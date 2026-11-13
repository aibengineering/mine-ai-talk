// Mine AI talk deck: navigation, step reveals, clips, tooltips and the speaker view.
// No dependencies and no network calls, so the deck runs from any static host or offline.
//
//   → / PageDown / Enter   next step or slide        ← / PageUp   back
//   Space                  on a clip you play (or the route): start or pause it, and move on once it has finished.
//                          If the next step is a pop clip, Space plays it; → reaches it without playing.
//                          Everywhere else it is the same as →. The arrows always move, so → skips a clip.
//   Shift + → / ←          the next or previous slide, past any steps left on this one
//   Home / End             first / last slide        F            fullscreen
//   S                      open the speaker view     T            hide or show TODO chips
//   K                      play or pause the clip    R            restart the clip      M   mute
//   touch                  a tap on the right does what Space does (plays the next clip, pauses one that's playing),
//                          a tap on the left goes back. A swipe is → or ←, so it always moves on, past any clip.

const slides = [...document.querySelectorAll('.slide')];
const viewport = document.getElementById('viewport');
const stage = document.getElementById('stage');
const isSpeaker = new URLSearchParams(location.search).has('speaker');
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('mine-ai-talk') : null;
const START_KEY = 'mine-ai-talk-start';
// TODO chips show while the deck is served locally or from the homelab; on any other host (GitHub Pages) they start
// hidden. T still toggles them.
if (!/^(localhost|127\.0\.0\.1|\[::1\]|homelab(\..*)?)$/.test(location.hostname) && location.protocol !== 'file:') document.body.classList.add('hide-todo');

let index = 0;
let step = 0;

const stepsOf = slide => [...slide.querySelectorAll('.step')];

// The talk's parts. A slide that opens a part carries data-chapter, the part's name. Each card's .chapters list gets
// every part in order: the ones before it ticked, its own lit. On screen those lists are hidden and only hold the
// space: the one that shows is #parts, below. In print they are what shows.
const chapters = slides.filter(slide => slide.dataset.chapter);
chapters.forEach((card, current) => {
  const list = card.querySelector('.chapters');
  if (!list) return;
  chapters.forEach((slide, n) => {
    const item = document.createElement('li');
    item.textContent = slide.dataset.chapter;
    if (n < current) item.className = 'done';
    if (n === current) item.className = 'on';
    list.append(item);
  });
});

// #parts is the same list, once, on the stage, and it stays up. Between cards it is a rail of numbered boxes down
// the right edge, with the part the talk is in lit: that is where the room looks to see where it is. On a chapter
// card the rail opens out into the full list with the names, still showing the part before; then that one gets its
// tick and the new one lights. Leaving the card folds it back to the rail. It gets out of the way on the title
// slide and on full-screen clips (class "away").
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const parts = document.createElement('ol');
parts.id = 'parts';
parts.className = 'chapters';
parts.setAttribute('aria-hidden', 'true');
chapters.forEach(slide => {
  const item = document.createElement('li');
  const name = document.createElement('span');
  name.textContent = slide.dataset.chapter;
  item.append(name);
  parts.append(item);
});
stage.append(parts);
let partsTimer = 0;
let partsFrom = -1;

function setPart(current) {
  [...parts.children].forEach((item, n) => {
    item.classList.toggle('done', n < current);
    item.classList.toggle('on', n === current);
  });
}

// Which part slide n is in: -1 before the first part, and one past the last for the appendix, so all seven are ticked.
function partAt(n) {
  if (slides[n].dataset.section === 'Appendix') return chapters.length;
  let current = -1;
  chapters.forEach((slide, k) => { if (slides.indexOf(slide) <= n) current = k; });
  return current;
}

function syncParts() {
  clearTimeout(partsTimer);
  const slide = slides[index];
  const current = partAt(index);
  const card = slide.classList.contains('chapter');
  const wasOpen = parts.classList.contains('open');
  const forward = partsFrom >= 0 && partsFrom < index;
  partsFrom = index;
  parts.classList.toggle('open', card);
  parts.classList.toggle('away', index === 0 || slide.classList.contains('bleed'));
  // Only arriving at a card from earlier in the talk gets the tick step. Stepping back onto one, a step on the card
  // it is already on, or any other slide: show it as it stands.
  if (!card || !forward || wasOpen || reducedMotion) { setPart(current); return; }
  setPart(current - 1);
  partsTimer = setTimeout(() => setPart(current), 550);
}

function fit() {
  const scale = Math.min(viewport.clientWidth / 1600, viewport.clientHeight / 900);
  stage.style.setProperty('--scale', String(scale));
}

// Numbers that count up when their slide comes on. data-count is where a number ends and data-as how it reads on the
// way ("hours" is minutes shown as "3 h 56", "dollars" has a $ in front). It ends on the text the slide was written
// with, and with reduced motion that text is all there is.
let countedSlide = -1;
let countFrame = 0;
function countUp() {
  if (index === countedSlide) return;
  countedSlide = index;
  cancelAnimationFrame(countFrame);
  document.querySelectorAll('[data-count][data-final]').forEach(el => { el.textContent = el.dataset.final; });
  const values = [...slides[index].querySelectorAll('[data-count]')];
  if (!values.length || reducedMotion) return;
  values.forEach(el => { el.dataset.final ||= el.textContent; });
  const read = (el, n) => el.dataset.as === 'hours' ? `${Math.floor(n / 60)} h ${String(n % 60).padStart(2, '0')}` : el.dataset.as === 'dollars' ? `$${n}` : String(n);
  const start = performance.now();
  const frame = now => {
    const t = Math.min(1, (now - start) / 900);
    const eased = 1 - (1 - t) ** 3;
    values.forEach(el => { el.textContent = t < 1 ? read(el, Math.round(Number(el.dataset.count) * eased)) : el.dataset.final; });
    if (t < 1) countFrame = requestAnimationFrame(frame);
  };
  countFrame = requestAnimationFrame(frame);
}

function show(nextIndex, nextStep, fromRemote = false, playPop = false) {
  index = Math.max(0, Math.min(slides.length - 1, nextIndex));
  const steps = stepsOf(slides[index]);
  step = Math.max(0, Math.min(steps.length, nextStep));
  mcbInstant();
  slides.forEach((slide, n) => slide.classList.toggle('active', n === index));
  steps.forEach((el, n) => el.classList.toggle('shown', n < step));
  history.replaceState(null, '', `${location.pathname}${location.search}#${index + 1}`);
  document.getElementById('progress').style.width = `${((index + 1) / slides.length) * 100}%`;
  // The part is on the rail on the right, so the footer only carries what comes after it: the area inside part 5,
  // or the label of a slide that isn't in a part.
  document.getElementById('where').textContent = (slides[index].dataset.section || '').replace(/^\d+ · [^·]*[^· ]( · )?/, '');
  document.getElementById('count').textContent = `${index + 1} / ${slides.length}`;
  syncClips();
  syncPops(playPop ? steps[step - 1] : null);
  syncRoute();
  syncParts();
  countUp();
  syncCue();
  renderSpeaker();
  if (!fromRemote && channel) channel.postMessage({ index, step, pop: playPop });
}

function next() {
  if (step < stepsOf(slides[index]).length) return show(index, step + 1);
  if (index < slides.length - 1) {
    if (!localStorage.getItem(START_KEY)) localStorage.setItem(START_KEY, String(Date.now()));
    show(index + 1, 0);
  }
}

function prev() {
  if (step > 0) return show(index, step - 1);
  if (index > 0) show(index - 1, Infinity);
}

// ---------- clips ----------
// <figure class="clip" data-src="media/x.mp4" data-mode="loop|play|route" data-label="..."></figure>
// Loops run silently while their slide is showing. A "play" clip waits for Space, K or a click.
// A "route" clip is one file cut into parts that Space plays straight through (see "the route clip" below).
// Clips are muted, except one marked data-sound, which has sound in the audience window only. With ?silent in the
// URL it plays its data-silent-src instead, muted, for a room with no speakers. A played clip runs in the speaker
// window too, always muted: every play, pause and restart is sent to the other window with the clip's time,
// which keeps the two in step whichever one has the keyboard.

const silent = new URLSearchParams(location.search).has('silent');
// On a phone the cues say Tap, since a tap on the right does what Space does.
const press = matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Space';

// A browser refuses sound until someone has clicked or pressed a key in that window. Play muted rather than not at all.
const playVideo = video => video.play().catch(() => {
  if (video.muted) return;
  video.muted = true;
  video.play().catch(() => {});
});

// A click on a clip's own play/pause button does what Space does to it: play or pause it, here and in the other window.
const clickToggle = video => event => {
  event.currentTarget.blur();
  if (!video.ended) clipCommand(video.paused ? 'play' : 'pause');
};

// A clip is paused once it has started and stopped short of its end (Space, K, a click, or the other window): it
// gets .paused, which lights its play/pause chip in the top-right corner. Loops have it too. A pop only shows it while it's up:
// → lands a playing pop by pausing it, and that isn't a pause.
function syncPaused(figure) {
  const video = figure.querySelector('video');
  const up = figure.dataset.mode !== 'pop' || (figure.classList.contains('playing') && !figure.classList.contains('landed'));
  figure.classList.toggle('paused', figure.classList.contains('started') && video.paused && !video.ended && up);
  figure.classList.toggle('ended', video.ended);
  syncCue();
}

function buildClip(figure) {
  const video = document.createElement('video');
  const src = silent && figure.dataset.silentSrc ? figure.dataset.silentSrc : figure.dataset.src;
  video.dataset.sound = 'sound' in figure.dataset && !silent && !isSpeaker ? 'on' : '';
  video.muted = !video.dataset.sound;
  video.playsInline = true;
  video.preload = ['route', 'pop'].includes(figure.dataset.mode) ? 'auto' : 'metadata';
  video.loop = figure.dataset.mode === 'loop';
  video.src = src;
  // Phones (iOS Safari) can stop at the metadata until something plays, so that already counts as ready.
  video.addEventListener('loadedmetadata', () => { figure.classList.add('ready'); syncCue(); });
  video.addEventListener('loadeddata', () => figure.classList.add('ready'));
  video.addEventListener('play', () => figure.classList.add('started'));
  video.addEventListener('loadeddata', () => syncCue());
  ['play', 'pause', 'ended'].forEach(type => video.addEventListener(type, () => syncPaused(figure)));
  if (figure.dataset.mode === 'pop') { video.addEventListener('ended', () => landPop(figure)); buildPopThumb(figure, video); }

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  placeholder.innerHTML = `<span>${figure.dataset.label || 'Clip'}</span><code>${src}</code>`;

  figure.append(video, placeholder);

  // One play/pause chip in the top-right corner, loops included: faint on hover while the clip plays, lit while it's paused. Nothing
  // covers or dims the frame, so Ben can pause and point at something in it.
  const corner = document.createElement('button');
  corner.type = 'button';
  corner.className = 'clip-toggle';
  corner.setAttribute('aria-label', 'Play or pause');
  corner.addEventListener('click', clickToggle(video));
  figure.append(corner);
  if (figure.dataset.mode !== 'play') return;

  const hint = document.createElement('div');
  hint.className = 'hint';
  hint.textContent = `▶ ${press} to play`;
  figure.append(hint);

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = '<button type="button" aria-label="Play or pause">▶</button><div class="scrub"><i></i></div><span class="time">0:00</span>';
  const [button, scrub, time] = controls.children;
  const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const toggle = () => clipCommand(video.paused ? 'play' : 'pause');
  button.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('play', () => { button.textContent = '❚❚'; });
  video.addEventListener('pause', () => { button.textContent = '▶'; });
  video.addEventListener('timeupdate', () => {
    scrub.firstElementChild.style.width = `${(video.currentTime / (video.duration || 1)) * 100}%`;
    time.textContent = `${clock(video.currentTime)} / ${clock(video.duration || 0)}`;
  });
  scrub.addEventListener('click', event => {
    const box = scrub.getBoundingClientRect();
    video.currentTime = ((event.clientX - box.left) / box.width) * (video.duration || 0);
  });
  figure.append(controls);
}

function syncClips() {
  for (const figure of document.querySelectorAll('.clip')) {
    const video = figure.querySelector('video');
    if (!video) continue;
    const active = figure.closest('.slide') === slides[index];
    // Loops only run in the audience window; the speaker window does not need them moving.
    if (active && !isSpeaker && figure.dataset.mode === 'loop') playVideo(video);
    else if (!active) { video.pause(); video.currentTime = 0; video.muted = !video.dataset.sound; figure.classList.remove('started', 'paused', 'ended'); delete figure.dataset.part; }
  }
}

// ---------- the Space cue ----------
// A chip in the middle of the footer whenever the next Space plays something: a played clip or the route that hasn't
// started, or a pop clip that is the next step (named by its caption), or "▶ Space to resume" while a clip is paused.
// The CSS hides it while a pop is playing, unless that pop is paused.

function syncCue() {
  const cue = document.getElementById('space-cue');
  if (!cue || !slides[index]) return;
  const slide = slides[index];
  const upNext = stepsOf(slide)[step];
  const pop = upNext?.classList.contains('pop') ? upNext : null;
  const clip = slide.querySelector('.clip.ready:is([data-mode="play"], [data-mode="route"]):not(.started)');
  const name = pop?.querySelector('figcaption b')?.textContent;
  const paused = slide.querySelector('.clip.paused');
  cue.textContent = paused ? `▶ ${press} to resume` : name ? `▶ ${press} to play: ${name}` : `▶ ${press} to play`;
  cue.classList.toggle('on', Boolean(paused || pop || clip));
}

// ---------- pop clips ----------
// <figure class="clip pop step" data-mode="pop" data-box="actions">: a step that plays big over its slide. Space on
// the step before it plays it: it grows out of its thumbnail in the .stack box or .compare card named by data-box, and when
// it ends it shrinks back into the thumbnail and fades, and the box lights (.landed, in the CSS). → reaches it without
// playing, so it lands straight away; → while it plays lands it and moves on. ← takes it back off.
// The thumbnail (.pop-thumb) shows where each clip lives: its first frame with a ▶ while it waits, an empty slot while it
// plays, and the frame it stopped on once it has landed. In a .stack box it sits above the small line; in a .compare
// card, at the end of the heading.

const popBox = figure => figure.popThumb || figure.closest('.slide').querySelector(`:is(.stack, .compare) .${figure.dataset.box}`);

function buildPopThumb(figure, video) {
  const box = figure.closest('.slide').querySelector(`:is(.stack, .compare) .${figure.dataset.box}`);
  if (!box) return;
  const thumb = document.createElement('div');
  thumb.className = 'pop-thumb';
  thumb.innerHTML = '<canvas class="first" width="320" height="180"></canvas><canvas class="last" width="320" height="180"></canvas><i class="pop-mark"></i>';
  const title = box.querySelector('h3');
  if (title) title.append(thumb);
  else box.insertBefore(thumb, box.querySelector(':scope > small'));
  figure.popThumb = thumb;
  video.addEventListener('loadeddata', () => {
    if (video.videoWidth) thumb.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    drawFrame(thumb.querySelector('.first'), video);
  }, { once: true });
}

function drawFrame(canvas, video) {
  try { canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); } catch { /* not decoded yet */ }
}

// The transform that puts the figure over its box, in stage pixels (the stage is scaled to fit the window).
function popToBox(figure) {
  const box = popBox(figure);
  if (!box) return 'scale(.2)';
  const scale = stage.getBoundingClientRect().width / stage.offsetWidth || 1;
  const was = figure.style.transform;
  figure.style.transform = 'none';
  const from = figure.getBoundingClientRect();
  figure.style.transform = was;
  const to = box.getBoundingClientRect();
  return `translate(${(to.left - from.left) / scale}px, ${(to.top - from.top) / scale}px) scale(${to.width / from.width}, ${to.height / from.height})`;
}

function playPop(figure) {
  const video = figure.querySelector('video');
  figure.classList.remove('landed', 'landing');
  figure.popThumb?.classList.remove('landed');
  figure.popThumb?.classList.add('out');
  figure.style.transition = 'none';
  figure.style.transform = reducedMotion ? 'none' : popToBox(figure);
  figure.getBoundingClientRect();
  figure.style.transition = '';
  figure.classList.add('playing');
  figure.style.transform = 'none';
  if (video) { video.currentTime = 0; playVideo(video); }
}

function landPop(figure, animate = true) {
  const video = figure.querySelector('video');
  if (video) video.pause();
  figure.classList.add('landed');
  figure.classList.remove('paused');
  const thumb = figure.popThumb;
  if (thumb) {
    // The frame it stopped on (the last one if it played through); skipped with →, it keeps the first frame.
    if (video && video.currentTime > 0.05) { drawFrame(thumb.querySelector('.last'), video); thumb.classList.add('has-last'); }
    thumb.classList.remove('out');
    thumb.classList.add('landed');
  }
  syncCue();
  if (!figure.classList.contains('playing')) return;
  if (!animate || reducedMotion) { figure.classList.remove('playing', 'landing'); figure.style.transform = ''; return; }
  figure.style.transform = popToBox(figure);
  figure.classList.add('landing');
  setTimeout(() => { figure.classList.remove('playing', 'landing'); figure.style.transform = ''; }, 520);
}

function syncPops(play) {
  for (const figure of document.querySelectorAll('.clip.pop')) {
    const onSlide = figure.closest('.slide') === slides[index];
    if (!onSlide || !figure.classList.contains('shown')) {
      const video = figure.querySelector('video');
      if (video) { video.pause(); video.currentTime = 0; }
      figure.classList.remove('playing', 'landing', 'landed', 'paused', 'ended', 'started');
      figure.popThumb?.classList.remove('out', 'landed', 'has-last');
      figure.style.transform = '';
    } else if (figure === play) playPop(figure);
    else landPop(figure, figure.classList.contains('playing'));
  }
}

// ---------- the route clip ----------
// data-segments="0,3.5,0 3.5,7,1 ...": each part is "start,end,first[-last]", in seconds, where first and last count
// the items of the slide's .chain that the part shows. Space plays the whole file straight through, like any clip you
// play, and the CSS brings it up once it has started. While it runs, the part under the playhead marks the chain:
// .on for its items, .ahead for later ones. It stops on its last frame, and the next Space moves on. The arrows
// always change slide, so a room that knows the game never has to sit through it.

const routeParts = figure => (figure.dataset.segments || '').trim().split(/\s+/).filter(Boolean).map(part => {
  const [start, end, items] = part.split(',');
  const [first, last = first] = items.split('-').map(Number);
  return { start: Number(start), end: Number(end), first, last };
});

let routeFrame = 0;

function syncRoute() {
  cancelAnimationFrame(routeFrame);
  const slide = slides[index];
  const figure = slide.querySelector('.clip[data-mode="route"]');
  const video = figure?.querySelector('video');
  if (!video) return;
  const parts = routeParts(figure);
  const items = [...slide.querySelectorAll('.chain li')];
  const mark = () => {
    const time = video.currentTime;
    const part = figure.classList.contains('started') ? (parts.find(p => time < p.end) || parts[parts.length - 1]) : null;
    items.forEach((item, n) => {
      item.classList.toggle('on', Boolean(part) && n >= part.first && n <= part.last);
      item.classList.toggle('ahead', Boolean(part) && n > part.last);
    });
    routeFrame = requestAnimationFrame(mark);
  };
  mark();
}

const activeVideo = () => slides[index].querySelector('.clip.pop.playing video') || slides[index].querySelector('.clip:not(.pop) video');
// The current slide's clip, if it is one you play (a played clip or the route) and its file has loaded.
const playableClip = () => slides[index].querySelector('.clip.ready:is([data-mode="play"], [data-mode="route"]) video');

function applyClip(action, time) {
  const video = activeVideo();
  if (!video) return;
  // The speaker window keeps its loops still, so a pause or resume of a loop is for the audience window only.
  if (isSpeaker && video.closest('.clip').dataset.mode === 'loop') return;
  if (action === 'mute') { if (!isSpeaker) video.muted = !video.muted; return; }
  if (action === 'restart') video.currentTime = 0;
  else if (Number.isFinite(time) && Math.abs(video.currentTime - time) > 0.3) video.currentTime = time;
  if (action === 'pause') video.pause();
  else playVideo(video);
}

// Runs a clip action here and in the other window.
function clipCommand(action) {
  const video = activeVideo();
  if (!video) return;
  // A loop only runs in the audience window, so the speaker window's still copy has no time worth sending.
  const time = video.closest('.clip').dataset.mode === 'loop' ? undefined : video.currentTime;
  applyClip(action, time);
  if (channel) channel.postMessage({ clip: action, time, index });
}

// ---------- tooltips ----------
const tip = document.getElementById('tip');
document.addEventListener('pointermove', event => {
  const target = event.target.closest?.('[data-tip]');
  if (!target) { tip.style.display = 'none'; return; }
  tip.textContent = target.dataset.tip;
  tip.style.display = 'block';
  const x = Math.min(event.clientX + 14, innerWidth - tip.offsetWidth - 8);
  tip.style.left = `${x}px`;
  tip.style.top = `${Math.max(8, event.clientY - tip.offsetHeight - 12)}px`;
});

// ---------- speaker view ----------
// Each slide's data-by is the minute its section should be finished by.

function renderSpeaker() {
  if (!isSpeaker) return;
  const slide = slides[index];
  const notes = slide.querySelector('aside.notes');
  document.getElementById('speaker-notes').innerHTML = notes ? notes.innerHTML : '<em>No notes for this slide.</em>';
  const upcoming = slides[index + 1];
  document.getElementById('speaker-next').textContent = upcoming
    ? `Next: ${upcoming.dataset.title || upcoming.querySelector('h1, h2')?.textContent || upcoming.dataset.section}`
    : 'Last slide';
  document.getElementById('speaker-section').textContent = `${slide.dataset.section} · finish by minute ${slide.dataset.by}`;
  tick();
}

function tick() {
  const started = Number(localStorage.getItem(START_KEY));
  const elapsed = started ? (Date.now() - started) / 1000 : 0;
  const clock = document.getElementById('speaker-clock');
  clock.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(Math.floor(elapsed % 60)).padStart(2, '0')}`;
  const by = Number(slides[index].dataset.by) * 60;
  const pace = document.getElementById('speaker-pace');
  const over = elapsed - by;
  pace.classList.toggle('behind', over > 0);
  pace.textContent = !started ? 'Timer starts when you leave the first slide.'
    : over > 0 ? `Behind: this section should have ended ${Math.ceil(over / 60)} min ago.`
    : `${Math.floor(-over / 60)} min ${Math.floor(-over % 60)} s left in this section.`;
}

// ---------- input ----------
// Space, or a tap on the right of a phone: resume a paused loop, pause or resume a pop that's up, play the pop that's
// the next step, play or pause the slide's clip or route, and otherwise move on like →. A running loop doesn't stop Space
// moving on: it's paused with its chip or K.
function space() {
  const clip = playableClip();
  const popping = slides[index].querySelector('.clip.pop.playing:not(.landing) video');
  const upNext = stepsOf(slides[index])[step];
  const pausedLoop = slides[index].querySelector('.clip.paused[data-mode="loop"]');
  if (pausedLoop) clipCommand('play');
  else if (popping) clipCommand(popping.paused ? 'play' : 'pause');
  else if (upNext?.classList.contains('pop')) show(index, step + 1, false, true);
  else if (clip && !clip.ended) clipCommand(clip.paused ? 'play' : 'pause');
  else next();
}

document.addEventListener('keydown', event => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key;
  // Typing in the database explorer must not turn the page. Escape hands the keys back to the deck.
  if (event.target.closest?.('input, textarea, select, .explorer')) { if (key === 'Escape') document.activeElement.blur(); return; }
  if (key === ' ') { event.preventDefault(); space(); }
  else if (event.shiftKey && key === 'ArrowRight') { event.preventDefault(); show(index, Infinity); next(); }
  else if (event.shiftKey && key === 'ArrowLeft') { event.preventDefault(); show(index, 0); prev(); }
  else if (['ArrowRight', 'PageDown', 'Enter'].includes(key)) { event.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(key)) { event.preventDefault(); prev(); }
  else if (key === 'Home') show(0, 0);
  else if (key === 'End') show(slides.length - 1, 0);
  else if (key === 'f' || key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  else if (key === 's' || key === 'S') window.open(`${location.pathname}?speaker#${index + 1}`, 'mine-ai-talk-speaker', 'width=1100,height=800');
  else if (key === 't' || key === 'T') document.body.classList.toggle('hide-todo');
  else if (key === 'k' || key === 'K') { const v = activeVideo(); if (v) clipCommand(v.paused ? 'play' : 'pause'); }
  else if (key === 'r' || key === 'R') clipCommand('restart');
  else if (key === 'm' || key === 'M') clipCommand('mute');
});

let touchStart = null;
viewport.addEventListener('pointerdown', event => { touchStart = { x: event.clientX, y: event.clientY }; });
viewport.addEventListener('pointerup', event => {
  if (!touchStart) return;
  if (event.target.closest('.explorer.loaded')) { touchStart = null; return; }
  const dx = event.clientX - touchStart.x;
  const dy = event.clientY - touchStart.y;
  touchStart = null;
  // A swipe always navigates, so a full-screen clip cannot trap a phone. A tap on a control does not.
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) return dx < 0 ? next() : prev();
  if (Math.abs(dx) > 8 || Math.abs(dy) > 8) return;
  if (event.target.closest('button, a, .clip.ready[data-mode="play"], [data-tip], .explorer')) return;
  const box = viewport.getBoundingClientRect();
  (event.clientX - box.left) / box.width < 0.3 ? prev() : space();
});

if (channel) channel.addEventListener('message', ({ data }) => {
  if (!data.clip) return show(data.index, data.step, true, Boolean(data.pop));
  if (data.index === index) applyClip(data.clip, data.time);
});
addEventListener('resize', fit);
addEventListener('hashchange', () => show((Number(location.hash.slice(1)) || 1) - 1, 0));

// ---------- Playing Minecraft (.mcb): its build moves boxes with CSS transitions (the mcb- block in deck.css) ----------
// One step forward or back plays the move. Arriving on the slide, or jumping more than one step (Shift+arrows, the
// hash, the speaker window catching up), should show that state at once: .mcb-instant turns the transitions off for
// two frames. Called from show() after the new index and step are set and before the classes change.
let mcbLast = { index: -1, step: -1 };
function mcbInstant() {
  const slide = slides[index];
  if (slide.classList.contains('mcb') && (mcbLast.index !== index || Math.abs(mcbLast.step - step) > 1)) {
    slide.classList.add('mcb-instant');
    requestAnimationFrame(() => requestAnimationFrame(() => slide.classList.remove('mcb-instant')));
  }
  mcbLast = { index, step };
}

// ---------- start ----------
document.querySelectorAll('.clip').forEach(buildClip);
if (isSpeaker) {
  document.body.classList.add('speaker');
  document.getElementById('speaker-reset').addEventListener('click', () => { localStorage.removeItem(START_KEY); tick(); });
  setInterval(tick, 500);
}
fit();
show((Number(location.hash.slice(1)) || 1) - 1, 0, true);
window.__deckReady = true;
