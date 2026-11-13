// Run database explorer for the appendix slide. Nothing here runs until the Load button is pressed:
// then it fetches sql.js (SQLite compiled to WebAssembly) and the gzipped database, and every query
// runs in the browser against an in-memory copy. Nothing is sent anywhere and the file is never changed.

const root = document.getElementById('explorer');
const RUN_START = '2026-09-15T00:43:35Z'; // when the bot joined the world
const runTime = column => `time(unixepoch(${column}) - unixepoch('${RUN_START}'), 'unixepoch')`;
const MAX_ROWS = 500;

const PRESETS = [
  ['Every call, in order', `SELECT q.request_id AS n, ${runTime('q.requested_at')} AS run_time, q.action_name AS tool,
       r.status, round(r.duration_ms / 1000.0, 1) AS seconds, q.rationale AS why
FROM action_requests q JOIN action_responses r USING (request_id)
ORDER BY q.request_id`],
  ['Most-used tools', `SELECT action_name AS tool, count(*) AS calls
FROM action_requests GROUP BY 1 ORDER BY 2 DESC`],
  ['How the calls ended', `SELECT status, count(*) AS calls
FROM action_responses GROUP BY 1 ORDER BY 2 DESC`],
  ['Calls that failed', `SELECT ${runTime('q.requested_at')} AS run_time, q.action_name AS tool, r.status, q.rationale AS why, r.response_json
FROM action_requests q JOIN action_responses r USING (request_id)
WHERE r.status IN ('failed', 'refused')
ORDER BY q.request_id`],
  ['Reflexes, as they fired', `SELECT ${runTime('observed_at')} AS run_time, summary
FROM events WHERE event_type = 'survival_outcome'
ORDER BY event_id`],
  ['Reflexes by type', `SELECT json_extract(payload_json, '$.source') AS reflex,
       json_extract(payload_json, '$.evidence.response') AS did, count(*) AS times
FROM events WHERE event_type = 'survival_outcome'
GROUP BY 1, 2 ORDER BY 3 DESC`],
  ['Overriding its own reflexes', `SELECT ${runTime('requested_at')} AS run_time,
       json_extract(request_json, '$.reason') AS reason,
       json_extract(request_json, '$.changes') AS changes,
       json_extract(request_json, '$.lifetime') AS lifetime
FROM action_requests WHERE action_name = 'set_survival_policy'
ORDER BY request_id`],
  ['Notes it left itself', `SELECT ${runTime('remembered_at')} AS run_time, note, context
FROM notes ORDER BY note_id`],
  ['Big moments', `SELECT ${runTime('observed_at')} AS run_time, event_type, summary
FROM events WHERE event_type <> 'survival_outcome' AND event_type NOT LIKE 'equipment%'
ORDER BY event_id`],
  ['What each table is', `SELECT table_name, description
FROM data_dictionary WHERE column_name IS NULL
ORDER BY table_name`],
];

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = el('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.append(script);
  });
}

async function fetchDatabase(url, onProgress) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const total = Number(response.headers.get('content-length')) || 0;
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress(received, total);
  }
  const blob = new Blob(chunks);
  const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  // Some hosts unzip .gz files on the way out, so check the bytes instead of trusting the name.
  const gzipped = head[0] === 0x1f && head[1] === 0x8b;
  const stream = gzipped ? blob.stream().pipeThrough(new DecompressionStream('gzip')) : blob.stream();
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function build(db, sizeBytes) {
  root.textContent = '';
  root.classList.add('loaded');

  const side = el('div', 'explorer-side');
  const main = el('div', 'explorer-main');
  const editor = el('textarea');
  editor.spellcheck = false;
  editor.setAttribute('aria-label', 'SQL query');
  const bar = el('div', 'explorer-bar');
  const runButton = el('button', 'primary', 'Run');
  runButton.type = 'button';
  const status = el('span', 'status');
  bar.append(runButton, el('span', 'hint', 'Ctrl + Enter'), status);
  const results = el('div', 'explorer-results');
  const detail = el('div', 'explorer-detail');
  detail.hidden = true;
  main.append(editor, bar, results, detail);

  function showDetail(column, value) {
    let text = value == null ? 'NULL' : String(value);
    try { if (/^[[{]/.test(text)) text = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON, show as is */ }
    detail.textContent = '';
    const close = el('button', null, 'Close');
    close.type = 'button';
    close.addEventListener('click', () => { detail.hidden = true; });
    const head = el('div', 'explorer-bar');
    head.append(el('strong', null, column), close);
    detail.append(head, el('pre', null, text));
    detail.hidden = false;
  }

  function run() {
    detail.hidden = true;
    results.textContent = '';
    const started = performance.now();
    let sets;
    try { sets = db.exec(editor.value); } catch (error) {
      status.textContent = '';
      results.append(el('p', 'error', String(error.message || error)));
      return;
    }
    const ms = Math.round(performance.now() - started);
    const last = sets[sets.length - 1];
    if (!last) { status.textContent = `No rows · ${ms} ms`; return; }
    const shown = last.values.slice(0, MAX_ROWS);
    status.textContent = `${last.values.length.toLocaleString()} rows${last.values.length > MAX_ROWS ? `, first ${MAX_ROWS} shown` : ''} · ${ms} ms`;
    const table = el('table');
    const headRow = el('tr');
    for (const column of last.columns) headRow.append(el('th', null, column));
    table.append(headRow);
    for (const row of shown) {
      const tr = el('tr');
      row.forEach((value, i) => {
        const text = value == null ? 'NULL' : value instanceof Uint8Array ? `[${value.length} bytes]` : String(value);
        const td = el('td', value == null ? 'null' : typeof value === 'number' ? 'num' : null, text.length > 140 ? `${text.slice(0, 140)}…` : text);
        td.addEventListener('click', () => showDetail(last.columns[i], value instanceof Uint8Array ? text : value));
        tr.append(td);
      });
      table.append(tr);
    }
    results.append(table);
    results.scrollTop = 0;
  }

  const use = sql => { editor.value = sql; run(); };

  side.append(el('h3', null, 'Try one'));
  const presets = el('div', 'explorer-list');
  for (const [label, sql] of PRESETS) {
    const button = el('button', null, label);
    button.type = 'button';
    button.addEventListener('click', () => use(sql));
    presets.append(button);
  }
  side.append(presets, el('p', 'size', `${(sizeBytes / 1e6).toFixed(1)} MB, sitting in your browser's memory. Click any cell to read the whole thing.`));

  const picker = el('select');
  picker.setAttribute('aria-label', 'Browse a table');
  picker.append(el('option', null, 'Browse a table…'));
  const listed = db.exec("SELECT name FROM sqlite_schema WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%' ORDER BY name")[0];
  for (const [name] of listed ? listed.values : []) picker.append(el('option', null, name));
  picker.addEventListener('change', () => {
    if (picker.selectedIndex > 0) use(`SELECT * FROM "${picker.value.replaceAll('"', '""')}" LIMIT 100`);
    picker.selectedIndex = 0;
  });
  bar.insertBefore(picker, status);

  runButton.addEventListener('click', run);
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); run(); }
  });

  root.append(side, main);
  use(PRESETS[0][1]);
}

if (root) {
  const button = root.querySelector('button.load');
  const status = root.querySelector('.status');
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      status.textContent = 'Loading SQLite…';
      const base = root.dataset.sqljs;
      await loadScript(`${base}sql-wasm.js`);
      const SQL = await window.initSqlJs({ locateFile: file => base + file });
      const bytes = await fetchDatabase(root.dataset.db, (received, total) => {
        status.textContent = total ? `Downloading the database… ${Math.round((received / total) * 100)}%` : `Downloading the database… ${(received / 1e6).toFixed(1)} MB`;
      });
      status.textContent = 'Opening…';
      build(new SQL.Database(bytes), bytes.byteLength);
    } catch (error) {
      button.disabled = false;
      status.textContent = `That did not load: ${error.message || error}. It needs to be opened from a web server, not from a file on disk.`;
    }
  });
}
