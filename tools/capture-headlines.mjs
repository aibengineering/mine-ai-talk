// Capture the headline block of each article as it renders today. Usage: node capture.mjs <outDir> [name]
// Ad slots and lead photos are hidden or cropped out; the two yellow highlights are added here.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('playwright-core')); }
const out = process.argv[2], only = process.argv[3];
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const b = await chromium.launch();

async function open(url, width = 620) {
  const ctx = await b.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 2, locale: 'en-AU', userAgent: UA });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await p.waitForTimeout(5000);
  return p;
}
async function shot(p, name, y0, y1, x0 = 0, x1 = null) {
  const w = p.viewportSize().width;
  const clip = { x: x0, y: Math.max(0, Math.round(y0)), width: (x1 ?? w) - x0, height: Math.round(y1 - Math.max(0, y0)) };
  await p.evaluate(() => scrollTo(0, 0));
  await p.screenshot({ path: `${out}/${name}.png`, clip, fullPage: true });
  console.log(name, JSON.stringify(clip));
}
// In-page helpers, passed as strings so each page gets the same ones.
const helpers = `
  window.__h1 = () => [...document.querySelectorAll('h1')].sort((a, b) => b.textContent.length - a.textContent.length)[0];
  window.__box = e => { const r = e.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right }; };
  window.__heroTop = () => { const hb = __box(__h1()).bottom; const c = [...document.querySelectorAll('img, figure, picture, video')]
    .map(e => e.getBoundingClientRect()).filter(r => r.width > innerWidth * 0.6 && r.height > 150 && r.top + scrollY > hb).map(r => r.top + scrollY); return Math.min(...c); };
  window.__mark = (needle, root = document.body) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const i = n.data.indexOf(needle); if (i < 0 || !n.parentElement.getClientRects().length) continue;
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + needle.length); const m = document.createElement('mark');
      m.style.cssText = 'background:#ffe45c;color:inherit;padding:0'; r.surroundContents(m); return true; } return false; };
`;
async function post(name, id, { dropQuote = false } = {}) {
  const ctx = await b.newContext({ viewport: { width: 560, height: 1000 }, deviceScaleFactor: 2, locale: 'en-AU', timezoneId: 'America/Los_Angeles', userAgent: UA });
  const p = await ctx.newPage();
  await p.goto(`https://platform.twitter.com/embed/Tweet.html?id=${id}&theme=light&dnt=true&lang=en`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await p.waitForTimeout(6000);
  const bottom = await p.evaluate(dropQuote => {
    const gone = e => { if (e) e.style.display = 'none'; };
    if (dropQuote) { // a quoted post: its avatar is the second one; hide the box it sits in
      const main = document.querySelector('[data-testid="tweetText"]');
      const av = [...document.querySelectorAll('img[src*="profile_images"]')][1];
      let e = av; while (e && e.parentElement && !e.parentElement.contains(main)) e = e.parentElement;
      gone(e);
    }
    for (const m of document.querySelectorAll('[data-testid="videoComponent"], [data-testid="tweetPhoto"], video, img[src*="media"], img[src*="thumb"]')) {
      let e = m; // climb to the bordered box the media sits in, but not past the post itself
      while (e.parentElement && e.parentElement.getBoundingClientRect().height < m.getBoundingClientRect().height + 40 && !e.parentElement.querySelector('[data-testid="tweetText"]')) e = e.parentElement;
      gone(e);
    }
    const time = document.querySelector('time');
    const row = time.closest('div');
    let e = row; while (e.nextElementSibling === null && e.parentElement) e = e.parentElement;
    for (let n = e.nextElementSibling; n; n = n.nextElementSibling) gone(n); // likes, reply, copy link, replies
    const r = time.getBoundingClientRect(); return r.bottom + scrollY;
  }, dropQuote);
  await p.waitForTimeout(300);
  const t = await p.evaluate(() => document.querySelector('time').getBoundingClientRect().bottom + scrollY);
  await shot(p, name, 0, t + 9);
}
const W = 560; // capture width for the news pages; the cards show them at about three quarters of that
const hide = (p, css) => p.addStyleTag({ content: `${css} { display: none !important; }` }).then(() => p.waitForTimeout(400));
const jobs = {
  // Anthropic's own write-up of Claude 3.7 Sonnet playing Pokémon (its section "Claude plays Pokémon"): the title, then the badges line.
  async thinking() {
    const url = 'https://www.anthropic.com/news/visible-extended-thinking';
    let p = await open(url, W);
    await p.evaluate(helpers);
    await p.evaluate(() => { // the same sticky contents strip as on the Fable post
      const hit = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.top < 200 && r.height < 110 && r.width > 400 && /^01\s*The visible/.test(e.textContent.trim()); });
      if (hit[0]) hit[0].style.display = 'none';
      __h1().parentElement.style.paddingTop = '10px'; });
    await p.waitForTimeout(300);
    await shot(p, 'thinking-title', 0, await p.evaluate(() => __box(__h1()).bottom + 22));
    await p.context().close();
    p = await open(url, 480);
    await p.evaluate(helpers);
    console.log('marked', await p.evaluate(() => __mark("successfully battling three Pokémon Gym Leaders (the game’s bosses) and winning their Badges.")));
    // Only the start of the paragraph down to the end of the highlighted line, so the card stays as short as the Fable one.
    const q = await p.evaluate(() => {
      const para = [...document.querySelectorAll('p')].find(e => /But Claude 3.7 Sonnet’s improved agentic/.test(e.textContent));
      const m = para.querySelector('mark').getBoundingClientRect(), pb = __box(para);
      return { top: pb.top, bottom: m.bottom + scrollY - 9, left: pb.left, right: pb.right }; });
    await shot(p, 'thinking-quote', q.top - 10, q.bottom + 10, Math.max(0, Math.round(q.left) - 16), Math.min(480, Math.round(q.right) + 16));
  },
  // Posts on X, through X's own embed page: the author, the words and the date. The attached video, the like and
  // reply row and the replies link are hidden. The clock is set to US Pacific, where both posts were made.
  async pichai() { await post('pichai', '1918455766542930004'); },
  async openaidevs() { await post('openaidevs', '1953551715543744547'); },
  // Gemini 3 Pro finishing Crystal, from the write-up by Joel Zhang, who runs the stream. (Google AI Studio's post on
  // 15 December 2025 is only a link to an X article, so there is nothing on it to show.)
  async crystal() {
    const url = 'https://blog.jcz.dev/gemini-3-pro-vs-25-pro-in-pokemon-crystal';
    let p = await open(url, 620);
    await p.evaluate(helpers);
    const t = await p.evaluate(() => { // masthead, title, and the date line under it
      return __box(document.querySelector('time[datetime^="2025-12-12"]')).bottom; });
    await shot(p, 'crystal-title', 0, t + 6);
    await p.context().close();
    p = await open(url, 480);
    await p.evaluate(helpers);
    console.log('marked', await p.evaluate(() => __mark('Gemini 3 Pro became the Johto Champion without losing a single battle.')));
    const q = await p.evaluate(() => {
      const para = [...document.querySelectorAll('p')].find(e => /Fast forward two weeks/.test(e.textContent));
      const m = para.querySelector('mark').getBoundingClientRect(), pb = __box(para);
      return { top: pb.top, bottom: m.bottom + scrollY - 9, left: pb.left, right: pb.right }; });
    await shot(p, 'crystal-quote', q.top - 4, q.bottom + 10, Math.max(0, Math.round(q.left) - 16), Math.min(480, Math.round(q.right) + 16));
  },
  async gpt5finish() { await post('gpt5-finish', '1955980772575268897', { dropQuote: true }); }, // Clad3815, who ran the stream: GPT-5 finished Red. The post it quotes (Victory Road) is left out.
  async engadget() {
    const p = await open('https://www.engadget.com/ai/claude-isnt-a-great-pokemon-player-and-thats-okay-151522448.html', W);
    await p.evaluate(helpers);
    await hide(p, 'p.subtitle');
    await shot(p, 'engadget', 0, await p.evaluate(() => __box(document.querySelector('.byline-container')).bottom + 18));
  },
  async techcrunch() {
    const p = await open('https://techcrunch.com/2025/05/03/googles-gemini-has-beaten-pokemon-blue-with-a-little-help', W);
    await p.evaluate(helpers);
    await hide(p, '[class*="hero-ad"], .article-hero__share, .article-hero__first-section, .article-hero__extension, .article-hero__credits-mobile');
    await shot(p, 'techcrunch', 0, await p.evaluate(() => __box(document.querySelector('.article-hero__bottom')).bottom + 26));
  },
  async techradar() {
    const p = await open('https://www.techradar.com/ai-platforms-assistants/chatgpt/gpt-5-just-completed-pokemon-red-in-a-new-world-record-time-claude-gemini-and-chatgpt-o3-arent-even-close', W);
    await p.evaluate(helpers);
    await hide(p, '.trending-bar-container');
    await shot(p, 'techradar', 0, await p.evaluate(() => __box(document.querySelector('.vds-byline-block')).bottom + 14));
  },
  async lesswrong() {
    const p = await open('https://www.lesswrong.com/posts/sehJYg5Yny9fvpbpt/a-year-late-claude-finally-beats-pokemon', 620); // narrower than this and the masthead shortens to LW
    await p.evaluate(helpers);
    await shot(p, 'lesswrong', 0, await p.evaluate(() => __box(__h1()).bottom + 76));
  },
  // The Google card is not a web page: tools/capture-report.py crops it from the PDF of the Gemini 2.5 report.
  async anthropic() {
    const url = 'https://www.anthropic.com/news/claude-fable-5-mythos-5';
    let p = await open(url, W);
    await p.evaluate(helpers);
    await p.evaluate(() => { // drop the sticky contents strip under the nav and the empty band above the title
      const hit = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.top < 200 && r.height < 110 && r.width > 400 && /^01\s*Evaluating/.test(e.textContent.trim()); });
      if (hit[0]) hit[0].style.display = 'none';
      __h1().parentElement.style.paddingTop = '10px'; });
    await p.waitForTimeout(300);
    await shot(p, 'anthropic-title', 0, await p.evaluate(() => __box(__h1()).bottom + 22));
    await p.context().close();
    p = await open(url, 480);
    await p.evaluate(helpers);
    console.log('marked', await p.evaluate(() => __mark('Fable 5 beat FireRed with a minimal, vision-only harness.')));
    const q = await p.evaluate(() => {
      const para = [...document.querySelectorAll('p')].find(e => /It also needs less scaffolding/.test(e.textContent));
      const w = document.createTreeWalker(para, NodeFilter.SHOW_TEXT); let n, top = null;
      while ((n = w.nextNode())) { const i = n.data.indexOf('also needs less scaffolding'); if (i < 0) continue;
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 10); top = r.getBoundingClientRect().top + scrollY; }
      const pb = __box(para); return { top, bottom: pb.bottom, left: pb.left, right: pb.right }; });
    await shot(p, 'anthropic-quote', q.top - 4, q.bottom + 10, Math.max(0, Math.round(q.left) - 16), Math.min(480, Math.round(q.right) + 16));
  },
};
for (const [name, job] of Object.entries(jobs)) {
  if (only && only !== name) continue;
  try { await job(); } catch (e) { console.log(name, 'FAILED', String(e).slice(0, 300)); }
  for (const c of b.contexts()) await c.close();
}
await b.close();
