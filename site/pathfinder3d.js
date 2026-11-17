// The pathfinder slide's field of blocks (17 November). It draws the same recorded A* run as the flat .ast-grid in the
// slide's markup, which it reads for its cells: terrain from each cell's class, the order squares were tried from --d and
// the route from --r. Blocks are extruded and lit, the square being tried lifts and glows, and the route rises in gold,
// after the look of the August "pathfinding in 3D" page. Canvas 2D on purpose: no GPU or WebGL context to lose on the day.
//
// It plays once when deck.js marks the slide .arrive-play (a single → onto it), on the same clock as the tally under it
// (80 ms a square, then 100 ms a move). Any other arrival, reduced motion and the speaker window show the finished route.
// The flat grid stays in the markup as the data, and is what prints.
(() => {
  const slide = document.querySelector('.slide.astar');
  const grid = slide && slide.querySelector('.ast-grid');
  if (!grid) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 22;
  const cells = [...grid.children].map(el => ({
    kind: ['x', 'wa', 'hi', 's', 'g'].find(k => el.classList.contains(k)) || 'grass',
    tried: el.classList.contains('t') ? Number(el.style.getPropertyValue('--d')) : 0,
    route: el.classList.contains('r') ? Number(el.style.getPropertyValue('--r')) : 0,
  }));
  const H = cells.length / W;
  if (!Number.isInteger(H)) return;
  const N = cells.length;
  const TRIED = cells.filter(c => c.tried).length;
  const STEP = 80, DRAW = TRIED * STEP + 300, MOVE = 100, FLASH = 520;

  const CW = 702, CH = 372, SCALE = 2;
  canvas.className = 'ast-3d';
  canvas.width = CW * SCALE; canvas.height = CH * SCALE;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', grid.getAttribute('aria-label') || '');
  grid.after(canvas);
  grid.parentElement.classList.add('has-3d');

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const COL = {
    grass: hex('#2f5a2c'), hi: hex('#4f8a3c'), x: hex('#74747e'), wa: hex('#2b5fa8'),
    s: hex('#7ee2a0'), g: hex('#f2c14e'), flash: hex('#ffe9a8'), route: hex('#f7d24b'), white: [1, 1, 1],
  };
  const BASE_H = { grass: 0.5, hi: 1.5, x: 3.1, wa: 0.3, s: 1.7, g: 1.7 };

  // ---- a small column-major mat4, enough for one perspective camera ----
  const mul = (a, b) => { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
  const persp = (fovy, asp, n, f) => { const t = 1 / Math.tan(fovy / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; };
  const look = (e, c) => {
    let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2]; let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    let xx = zz, xy = 0, xz = -zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xz /= l;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
  };

  const curH = new Float32Array(N), curE = new Float32Array(N), curC = new Float32Array(N * 3);
  const tgtH = new Float32Array(N), tgtE = new Float32Array(N), tgtC = new Float32Array(N * 3);
  const order = cells.map((_, i) => i), dist = new Float32Array(N), pt = new Float32Array(16);

  // What every block should look like t milliseconds into the run (Infinity: the finished route).
  const targets = (t, now) => {
    for (let i = 0; i < N; i++) {
      const cell = cells[i];
      let c = COL[cell.kind], h = BASE_H[cell.kind], e = 0;
      if (cell.kind === 'wa' && Number.isFinite(now)) h += 0.035 * Math.sin(now / 520 + (i % W) * 1.3 + Math.floor(i / W) * 0.8);
      if (cell.kind === 's') e = 0.35;
      if (cell.kind === 'g') e = 0.45;
      if (cell.tried) {
        const since = t - cell.tried * STEP;
        if (since >= 0 && since < FLASH) { c = COL.flash; e = 0.5; h += 0.6; }
        else if (since >= FLASH) { c = mix(c, COL.white, 0.2); e = 0.06; h += 0.1; }
      }
      if (cell.route && t >= DRAW + cell.route * MOVE) { c = COL.route; e = 0.9; h += cell.kind === 'wa' ? 0.75 : 0.55; }
      tgtH[i] = h; tgtE[i] = e; tgtC[i * 3] = c[0]; tgtC[i * 3 + 1] = c[1]; tgtC[i * 3 + 2] = c[2];
    }
  };

  const draw = (th, ph, r) => {
    const cp = Math.cos(ph), sp = Math.sin(ph);
    const eye = [r * cp * Math.sin(th), r * sp, r * cp * Math.cos(th) + 0.4];
    const VP = mul(persp(0.5, CW / CH, 0.5, 200), look(eye, [0, 0.2, 0.9]));
    const pj = (k, x, y, z) => {
      const a = VP[0] * x + VP[4] * y + VP[8] * z + VP[12], b = VP[1] * x + VP[5] * y + VP[9] * z + VP[13], w = VP[3] * x + VP[7] * y + VP[11] * z + VP[15] || 1e-6;
      pt[k * 2] = (a / w * 0.5 + 0.5) * canvas.width; pt[k * 2 + 1] = (1 - (b / w * 0.5 + 0.5)) * canvas.height;
    };
    const quad = (a, b, c, d, fill) => {
      ctx.beginPath(); ctx.moveTo(pt[a * 2], pt[a * 2 + 1]); ctx.lineTo(pt[b * 2], pt[b * 2 + 1]); ctx.lineTo(pt[c * 2], pt[c * 2 + 1]); ctx.lineTo(pt[d * 2], pt[d * 2 + 1]); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
    };
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < N; i++) { const dx = (i % W) - (W - 1) / 2 - eye[0], dz = Math.floor(i / W) - (H - 1) / 2 - eye[2]; dist[i] = dx * dx + dz * dz; }
    order.sort((a, b) => dist[b] - dist[a]); // far to near
    const s = 0.47, labels = [];
    for (const i of order) {
      const cx = (i % W) - (W - 1) / 2, cz = Math.floor(i / W) - (H - 1) / 2, h = curH[i], e = curE[i], j = i * 3;
      const shade = m => { const k = m + e * 0.75; return `rgb(${Math.min(255, curC[j] * k * 255 | 0)},${Math.min(255, curC[j + 1] * k * 255 | 0)},${Math.min(255, curC[j + 2] * k * 255 | 0)})`; };
      pj(0, cx - s, h, cz - s); pj(1, cx + s, h, cz - s); pj(2, cx + s, h, cz + s); pj(3, cx - s, h, cz + s);
      pj(4, cx - s, 0, cz - s); pj(5, cx + s, 0, cz - s); pj(6, cx + s, 0, cz + s); pj(7, cx - s, 0, cz + s);
      ctx.shadowBlur = 0;
      if (eye[2] > cz) quad(3, 2, 6, 7, shade(0.5)); else quad(0, 1, 5, 4, shade(0.5));
      if (eye[0] > cx) quad(1, 2, 6, 5, shade(0.66)); else quad(0, 3, 7, 4, shade(0.66));
      if (e > 0.5) { ctx.shadowColor = shade(1); ctx.shadowBlur = 14 * SCALE * e; }
      quad(0, 1, 2, 3, shade(1));
      const kind = cells[i].kind;
      if (kind === 's' || kind === 'g') { pj(8 % 8, cx, h, cz); labels.push([kind === 's' ? 'A' : 'B', pt[0], pt[1]]); }
    }
    ctx.shadowBlur = 0;
    ctx.font = `700 ${15 * SCALE}px "Departure Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#0b0910';
    for (const [text, x, y] of labels) ctx.fillText(text, x, y);
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = reduced || new URLSearchParams(location.search).has('speaker');
  const REST = { th: -0.16, ph: 0.82, r: 27.5 };
  let raf = 0, start = 0, playing = false, last = 0;

  const snap = () => { curH.set(tgtH); curE.set(tgtE); curC.set(tgtC); };
  const finished = () => { targets(Infinity, NaN); snap(); draw(REST.th, REST.ph, REST.r); };

  const frame = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = playing ? now - start : Infinity;
    targets(t, now);
    const k = 1 - Math.exp(-dt * 12);
    for (let i = 0; i < N; i++) {
      curH[i] += (tgtH[i] - curH[i]) * k; curE[i] += (tgtE[i] - curE[i]) * k;
      const j = i * 3; curC[j] += (tgtC[j] - curC[j]) * k; curC[j + 1] += (tgtC[j + 1] - curC[j + 1]) * k; curC[j + 2] += (tgtC[j + 2] - curC[j + 2]) * k;
    }
    // The camera comes down from low and far as the run starts, then sways a little so the blocks read as solid.
    const intro = playing ? Math.min(1, (now - start) / 1800) : 1, ease = 1 - Math.pow(1 - intro, 3);
    draw(REST.th + 0.07 * Math.sin(now / 3800), 0.42 + (REST.ph - 0.42) * ease, REST.r * (1.3 - 0.3 * ease));
    raf = requestAnimationFrame(frame);
  };

  const sync = () => {
    cancelAnimationFrame(raf); raf = 0;
    if (!slide.classList.contains('active')) { playing = false; return; }
    if (still) return finished();
    const arrive = slide.classList.contains('arrive-play');
    if (arrive && !playing) { playing = true; start = performance.now(); targets(-1, NaN); snap(); }
    if (!arrive) { playing = false; targets(Infinity, NaN); snap(); }
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  new MutationObserver(sync).observe(slide, { attributes: true, attributeFilter: ['class'] });
  finished();
  sync();
})();
