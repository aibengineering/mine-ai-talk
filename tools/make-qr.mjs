// Writes a QR code as a tiny PNG: one pixel a module, with the four-module quiet border, dark on white.
// The deck scales it up with hard edges, like the icons. Nothing is fetched; the code is worked out here.
//   NODE_PATH=<a node_modules with qrcode in it> node tools/make-qr.mjs <text> <out.png>
// If jsqr is there too, the picture is read back and checked against the text before it is written.
import { createRequire } from 'node:module';
import { deflateSync, crc32 } from 'node:zlib';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const QRCode = require('qrcode');
const [text, out] = process.argv.slice(2);
if (!text || !out) { console.error('usage: make-qr.mjs <text> <out.png>'); process.exit(1); }

const QUIET = 4;
const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
const side = modules.size + QUIET * 2;
const dark = (x, y) => { const mx = x - QUIET, my = y - QUIET; return mx >= 0 && my >= 0 && mx < modules.size && my < modules.size && modules.get(my, mx); };

let jsQR = null;
try { jsQR = require('jsqr'); } catch { /* no reader to hand: skip the check */ }
if (jsQR) {
  const scale = 4, width = side * scale;
  const rgba = new Uint8ClampedArray(width * width * 4);
  for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
    const value = dark(Math.floor(x / scale), Math.floor(y / scale)) ? 0 : 255;
    rgba.set([value, value, value, 255], (y * width + x) * 4);
  }
  const read = jsQR(rgba, width, width);
  if (!read || read.data !== text) { console.error('read back as', read && read.data); process.exit(1); }
}

// An 8-bit greyscale PNG: each row is a filter byte (0, none) and then one byte a pixel.
const raw = Buffer.alloc(side * (side + 1));
for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) raw[y * (side + 1) + 1 + x] = dark(x, y) ? 0 : 255;
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const check = Buffer.alloc(4); check.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, check]);
};
const header = Buffer.alloc(13);
header.writeUInt32BE(side, 0); header.writeUInt32BE(side, 4); header[8] = 8; header[9] = 0;
writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log(`${out}: ${side} x ${side} px (${modules.size} modules a side${jsQR ? ', read back fine' : ''})`);
