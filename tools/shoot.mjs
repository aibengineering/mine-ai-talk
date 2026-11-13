// Screenshot every slide and report anything that overflows the 1600x900 stage.
//   NODE_PATH=<a node_modules with playwright or playwright-core> node tools/shoot.mjs [outDir] [baseUrl]
// baseUrl defaults to the local file, so no server is needed. This project has no dependencies of its own,
// so borrow Playwright from a sibling, e.g. NODE_PATH=../2610_neural_visual/node_modules.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); }
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = process.argv[2] || join(root, 'tools', 'shots');
const base = process.argv[3] || pathToFileURL(join(root, 'site', 'index.html')).href;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
// Reduced motion, so anything that animates in (the parts list on the chapter cards) is already in place for the screenshot.
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(base);
await page.waitForFunction(() => window.__deckReady);
const count = await page.evaluate(() => document.querySelectorAll('.slide').length);
let problems = 0;
for (let n = 1; n <= count; n++) {
  await page.evaluate(n => {
    location.hash = String(n);
  }, n);
  await page.waitForFunction(n => document.querySelectorAll('.slide')[n - 1].classList.contains('active'), n);
  // Reveal every step so the screenshot shows the fullest state of the slide. The route slide is the exception:
  // it is checked as it opens (which is also how it prints), then each of its steps gets a screenshot of its own.
  await page.evaluate(() => document.querySelectorAll('.slide.active:not(.route) .step').forEach(el => el.classList.add('shown')));
  await page.waitForTimeout(250);
  const over = await page.evaluate(() => {
    const slide = document.querySelector('.slide.active');
    if (slide.classList.contains('bleed')) return [];
    const bad = [];
    for (const el of slide.querySelectorAll('*')) {
      if (el.closest('aside.notes, .route .clip') || el.tagName === 'VIDEO') continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      // The right limit is the parts rail, which sits in the right margin from x = 1540.
      if (r.right > 1600 - 72 || r.left < 60 || r.bottom > 900 - 56 || r.top < 30) bad.push(`${el.tagName.toLowerCase()}.${el.className} [${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}]`);
    }
    return bad.slice(0, 4);
  });
  if (over.length) { problems++; console.log(`slide ${n}: outside the safe area`, over); }
  await page.screenshot({ path: join(out, `slide-${String(n).padStart(2, '0')}.png`) });
  // The route slide plays its clip straight through on Space: one screenshot from the middle of each part.
  const routeMids = await page.evaluate(() => {
    const figure = document.querySelector('.slide.active.route .clip[data-mode="route"]');
    return figure ? figure.dataset.segments.trim().split(/\s+/).map(p => { const [a, b] = p.split(',').map(Number); return (a + b) / 2; }) : [];
  });
  if (routeMids.length) {
    await page.waitForFunction(() => document.querySelector('.slide.active .clip')?.classList.contains('ready'), null, { timeout: 15000 }).catch(() => {});
    await page.keyboard.press(' ');
    for (const [s, mid] of routeMids.entries()) {
      await page.waitForFunction(mid => { const v = document.querySelector('.slide.active .clip video'); return !v || v.error || v.currentTime >= mid; }, mid, { timeout: 30000 }).catch(() => {});
      await page.screenshot({ path: join(out, `slide-${String(n).padStart(2, '0')}-part-${s + 1}.png`) });
    }
  }
}
console.log(`${count} slides, ${problems} with overflow, ${errors.length} page errors`, errors.filter(e => !/media\/.*mp4|ERR_FILE_NOT_FOUND/.test(e)));
await browser.close();
