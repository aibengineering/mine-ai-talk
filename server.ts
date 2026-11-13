// Mine AI talk server (Bun). Serves site/ as static files with no build step. Read-only: there is no API
// and nothing is written. The deck uses only relative URLs, so site/ also works unchanged on GitHub Pages.
//
//   PORT=8850 HOST=127.0.0.1,<tailnet-host> bun server.ts
//   GET /            site/index.html
//   GET /<file>      anything under site/ (deck.css, deck.js, media/, data/, vendor/...)
//
// MP4 requests honour Range headers so clips can be scrubbed, including on iOS Safari.
import { join, extname, normalize } from 'node:path';

const SITE = join(import.meta.dir, 'site');
const PORT = Number(process.env.PORT || 8850);
const HOSTS = (process.env.HOST || '127.0.0.1').split(',').map(h => h.trim()).filter(Boolean);
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt; charset=utf-8', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm', '.gz': 'application/gzip',
};

const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };

export async function handle(req: Request): Promise<Response> {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers });
  let path: string;
  try { path = decodeURIComponent(new URL(req.url).pathname); } catch { return new Response('Bad request', { status: 400, headers }); }
  if (path === '/') path = '/index.html';
  const full = normalize(join(SITE, path));
  const type = TYPES[extname(full)];
  if (!type || !full.startsWith(SITE + '/')) return new Response('Not found', { status: 404, headers });
  const file = Bun.file(full);
  if (!(await file.exists())) return new Response('Not found', { status: 404, headers });

  const base = { ...headers, 'Content-Type': type, 'Accept-Ranges': 'bytes' };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
  if (range && (range[1] || range[2])) {
    const size = file.size;
    // "bytes=-N" means the last N bytes; otherwise start-end with an open end allowed.
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${size}` } });
    const partial = { ...base, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) };
    return new Response(req.method === 'HEAD' ? null : file.slice(start, end + 1), { status: 206, headers: partial });
  }
  return new Response(req.method === 'HEAD' ? null : file, { headers: base });
}

if (import.meta.main) {
  for (const hostname of HOSTS) {
    Bun.serve({ hostname, port: PORT, fetch: handle, error: e => new Response(`Error: ${e.message}`, { status: 500, headers }) });
    console.log(`Mine AI talk: http://${hostname}:${PORT}`);
  }
}
