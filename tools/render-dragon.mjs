// Renders site/art/ender-dragon.png and site/art/dragon-head.png from the Pixel Perfection dragon texture.
//   NODE_PATH=<a node_modules with playwright> node tools/render-dragon.mjs <folder holding three.module.js and three.core.js> [outDir] [query]
// Three.js is only needed here, to make the two images; the deck itself does not load it.
// The optional query string (e.g. "eye=250,105,290") moves the camera; see the end of dragon.html.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); }
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const three = process.argv[2];
if (!three) throw new Error('Pass the folder that holds three.module.js and three.core.js');
const out = process.argv[3] || join(root, 'site', 'art');
const query = process.argv[4] ? `?${process.argv[4]}` : '';
mkdirSync(out, { recursive: true });

// The page is served from disk by intercepting requests, so nothing needs a web server.
const files = {
  '/': [join(root, 'tools', 'dragon.html'), 'text/html'],
  '/three.module.js': [join(three, 'three.module.js'), 'text/javascript'],
  '/three.core.js': [join(three, 'three.core.js'), 'text/javascript'],
  '/dragon.png': [join(root, 'site', 'vendor', 'pixel-perfection', 'dragon.png'), 'image/png'],
};

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('pageerror', e => console.error(String(e)));
page.on('console', m => { if (m.type() === 'error') console.error(m.text()); });
await page.route('http://dragon.local/**', route => {
  const hit = files[new URL(route.request().url()).pathname];
  return hit ? route.fulfill({ body: readFileSync(hit[0]), contentType: hit[1] }) : route.fulfill({ status: 404, body: 'Not found' });
});
await page.goto(`http://dragon.local/${query}`);
await page.waitForFunction(() => window.__renders, null, { timeout: 60000 });
const renders = await page.evaluate(() => window.__renders);
for (const [name, { url, width, height }] of Object.entries(renders)) {
  writeFileSync(join(out, `${name}.png`), Buffer.from(url.split(',')[1], 'base64'));
  console.log(`${name}.png ${width}x${height}`);
}
await browser.close();
