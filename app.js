const http = require("http");
const os = require("os");

function getServerStats() {
  const uptime = process.uptime();
  const hrs = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);
  const mem = process.memoryUsage();
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  return {
    uptime: `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2),
    heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2),
    rss: (mem.rss / 1024 / 1024).toFixed(2),
    freeMemMB: (freeMem / 1024 / 1024).toFixed(0),
    totalMemMB: (totalMem / 1024 / 1024).toFixed(0),
    cpuModel: os.cpus()[0]?.model || "Unknown",
    cpuCores: os.cpus().length,
    hostname: os.hostname(),
    loadAvg: os.loadavg().map(n => n.toFixed(2)).join(", "),
  };
}

let requestCount = 0;
const requestLog = [];

const HTML = () => {
  const s = getServerStats();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Node.js Live Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #020b14;
      --surface: #050f1c;
      --card: #071626;
      --border: #0d3050;
      --accent: #00d4ff;
      --accent2: #00ff9d;
      --accent3: #ff6b35;
      --text: #c8e6f5;
      --muted: #4a7a99;
      --glow: 0 0 20px rgba(0, 212, 255, 0.3);
      --glow2: 0 0 20px rgba(0, 255, 157, 0.3);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Rajdhani', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }

    canvas#bg {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
      pointer-events: none;
    }

    .wrapper {
      position: relative;
      z-index: 1;
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* ── HEADER ── */
    header {
      text-align: center;
      margin-bottom: 48px;
      animation: fadeDown 0.8s ease both;
    }

    .badge {
      display: inline-block;
      background: rgba(0,212,255,0.08);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 3px;
      padding: 4px 14px;
      border-radius: 2px;
      margin-bottom: 18px;
      text-transform: uppercase;
      box-shadow: var(--glow);
    }

    h1 {
      font-size: clamp(2.4rem, 6vw, 4rem);
      font-weight: 700;
      letter-spacing: 2px;
      line-height: 1.1;
      background: linear-gradient(135deg, #ffffff 0%, var(--accent) 60%, var(--accent2) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin-top: 10px;
      font-size: 1.05rem;
      color: var(--muted);
      font-family: 'Share Tech Mono', monospace;
      letter-spacing: 1px;
    }

    .status-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 18px;
    }

    .dot {
      width: 9px; height: 9px;
      border-radius: 50%;
      background: var(--accent2);
      box-shadow: 0 0 10px var(--accent2);
      animation: pulse 1.6s infinite;
    }

    .status-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      color: var(--accent2);
      letter-spacing: 2px;
    }

    /* ── GRID ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 22px 20px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
      animation: fadeUp 0.6s ease both;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: var(--glow);
    }

    .card:hover::before { opacity: 1; }

    .card-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      color: var(--muted);
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--accent);
      font-family: 'Share Tech Mono', monospace;
      line-height: 1;
      word-break: break-all;
    }

    .card-value.green { color: var(--accent2); }
    .card-value.orange { color: var(--accent3); }
    .card-value.small { font-size: 1.1rem; }

    .card-sub {
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: 6px;
      font-family: 'Share Tech Mono', monospace;
    }

    /* ── MEMORY BAR ── */
    .mem-bar-wrap {
      margin-top: 10px;
    }

    .mem-bar-track {
      height: 6px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .mem-bar-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 1s ease;
    }

    /* ── WIDE CARDS ── */
    .wide { grid-column: span 2; }

    @media (max-width: 600px) { .wide { grid-column: span 1; } }

    /* ── LOG ── */
    .log-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 24px;
      animation: fadeUp 0.9s ease both;
    }

    .log-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .log-title {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 3px;
      color: var(--accent);
      text-transform: uppercase;
    }

    .log-clear {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      cursor: pointer;
      background: none;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 3px 10px;
      border-radius: 3px;
      transition: all 0.2s;
    }

    .log-clear:hover { border-color: var(--accent3); color: var(--accent3); }

    #log-list {
      list-style: none;
      max-height: 180px;
      overflow-y: auto;
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }

    #log-list li {
      padding: 5px 0;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      display: flex;
      gap: 12px;
      animation: slideIn 0.3s ease;
    }

    .log-time { color: var(--muted); min-width: 90px; }
    .log-method { color: var(--accent2); min-width: 40px; }
    .log-path { color: var(--text); }
    .log-empty { color: var(--muted); font-style: italic; }

    /* ── BUTTONS ── */
    .actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 24px;
      animation: fadeUp 1s ease both;
    }

    .btn {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      letter-spacing: 2px;
      padding: 12px 24px;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      background: transparent;
      transition: all 0.25s;
      text-transform: uppercase;
      position: relative;
      overflow: hidden;
    }

    .btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.25s;
    }

    .btn:hover::after { opacity: 0.08; }
    .btn:active { transform: scale(0.97); }

    .btn-cyan  { border-color: var(--accent);  color: var(--accent);  }
    .btn-green { border-color: var(--accent2); color: var(--accent2); }
    .btn-orange{ border-color: var(--accent3); color: var(--accent3); }

    .btn-cyan:hover  { box-shadow: var(--glow);  }
    .btn-green:hover { box-shadow: var(--glow2); }

    /* ── FOOTER ── */
    footer {
      text-align: center;
      padding-top: 20px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 2px;
      border-top: 1px solid var(--border);
      animation: fadeUp 1.1s ease both;
    }

    footer span { color: var(--accent); }

    /* ── TOAST ── */
    #toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--card);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      padding: 12px 22px;
      border-radius: 4px;
      box-shadow: var(--glow);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s;
      pointer-events: none;
      z-index: 999;
    }
    #toast.show { opacity: 1; transform: translateY(0); }

    /* ── ANIMATIONS ── */
    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(1.4); }
    }

    .card:nth-child(2) { animation-delay: 0.1s; }
    .card:nth-child(3) { animation-delay: 0.2s; }
    .card:nth-child(4) { animation-delay: 0.3s; }
    .card:nth-child(5) { animation-delay: 0.4s; }
    .card:nth-child(6) { animation-delay: 0.5s; }
  </style>
</head>
<body>

<canvas id="bg"></canvas>

<div class="wrapper">

  <header>
    <div class="badge">&#9632; AWS Deployed</div>
    <h1>Hello World 🌍</h1>
    <p class="subtitle">Node.js App &nbsp;/&nbsp; Live Dashboard</p>
    <div class="status-row">
      <div class="dot"></div>
      <span class="status-label">BACKEND RUNNING ON PORT 3000</span>
    </div>
  </header>

  <!-- STATS GRID -->
  <div class="grid" id="stats-grid">
    <div class="card">
      <div class="card-label">Uptime</div>
      <div class="card-value green small" id="uptime">${s.uptime}</div>
      <div class="card-sub">hh:mm:ss</div>
    </div>
    <div class="card">
      <div class="card-label">Requests</div>
      <div class="card-value orange" id="req-count">${requestCount}</div>
      <div class="card-sub">total served</div>
    </div>
    <div class="card">
      <div class="card-label">Node.js</div>
      <div class="card-value small" id="node-ver">${s.nodeVersion}</div>
      <div class="card-sub">${s.platform} / ${s.arch}</div>
    </div>
    <div class="card">
      <div class="card-label">Process ID</div>
      <div class="card-value" id="pid">${s.pid}</div>
      <div class="card-sub">PID</div>
    </div>
    <div class="card">
      <div class="card-label">Heap Used</div>
      <div class="card-value small" id="heap">${s.heapUsed} MB</div>
      <div class="card-sub">of ${s.heapTotal} MB total</div>
      <div class="mem-bar-wrap">
        <div class="mem-bar-track">
          <div class="mem-bar-fill" id="heap-bar" style="width:${Math.round((s.heapUsed/s.heapTotal)*100)}%"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-label">System Memory</div>
      <div class="card-value small" id="sys-mem">${s.freeMemMB} MB</div>
      <div class="card-sub">free of ${s.totalMemMB} MB</div>
      <div class="mem-bar-wrap">
        <div class="mem-bar-track">
          <div class="mem-bar-fill" id="mem-bar" style="width:${Math.round(((s.totalMemMB - s.freeMemMB)/s.totalMemMB)*100)}%;background:linear-gradient(90deg,var(--accent2),var(--accent3))"></div>
        </div>
      </div>
    </div>
    <div class="card wide">
      <div class="card-label">CPU</div>
      <div class="card-value small" id="cpu">${s.cpuModel}</div>
      <div class="card-sub">${s.cpuCores} cores &nbsp;·&nbsp; Load avg: ${s.loadAvg} &nbsp;·&nbsp; Host: ${s.hostname}</div>
    </div>
  </div>

  <!-- REQUEST LOG -->
  <div class="log-box">
    <div class="log-header">
      <span class="log-title">&#9632; Request Log</span>
      <button class="log-clear" onclick="clearLog()">CLEAR</button>
    </div>
    <ul id="log-list">
      <li><span class="log-empty">No requests yet — interact below to see logs.</span></li>
    </ul>
  </div>

  <!-- ACTIONS -->
  <div class="actions">
    <button class="btn btn-cyan"  onclick="pingServer()">⚡ PING SERVER</button>
    <button class="btn btn-green" onclick="refreshStats()">↻ REFRESH STATS</button>
    <button class="btn btn-orange" onclick="copyInfo()">⎘ COPY INFO</button>
  </div>

  <footer>
    Deployed on <span>AWS</span> &nbsp;·&nbsp; Built with <span>Node.js</span> &nbsp;·&nbsp; Port <span>3000</span>
  </footer>

</div>

<div id="toast"></div>

<script>
  /* ── PARTICLE CANVAS ── */
  (function () {
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(a, b) { return Math.random() * (b - a) + a; }

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.4, 1.8),
        vx: rand(-0.2, 0.2), vy: rand(-0.15, -0.4),
        alpha: rand(0.2, 0.7),
        color: Math.random() > 0.5 ? '0,212,255' : '0,255,157'
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = rand(0, W); }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(\${p.color},\${p.alpha})\`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ── LIVE UPTIME COUNTER ── */
  let startTime = Date.now();
  const initialUptime = "${s.uptime}".split(":").reduce((acc, v, i) => acc + parseInt(v) * [3600, 60, 1][i], 0);

  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000) + initialUptime;
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    document.getElementById('uptime').textContent =
      String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }, 1000);

  /* ── LOG ── */
  let logItems = [];
  function addLog(method, path) {
    const now = new Date();
    const time = now.toTimeString().slice(0,8);
    logItems.unshift({ time, method, path });
    if (logItems.length > 20) logItems.pop();
    renderLog();
  }

  function renderLog() {
    const ul = document.getElementById('log-list');
    if (!logItems.length) {
      ul.innerHTML = '<li><span class="log-empty">No requests yet.</span></li>';
      return;
    }
    ul.innerHTML = logItems.map(l =>
      \`<li>
        <span class="log-time">\${l.time}</span>
        <span class="log-method">\${l.method}</span>
        <span class="log-path">\${l.path}</span>
      </li>\`
    ).join('');
  }

  function clearLog() { logItems = []; renderLog(); }

  /* ── TOAST ── */
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
  }

  /* ── ACTIONS ── */
  function pingServer() {
    addLog('GET', '/ping');
    showToast('✓ Pong! Server is alive.');
    document.getElementById('req-count').textContent =
      parseInt(document.getElementById('req-count').textContent) + 1;
  }

  function refreshStats() {
    addLog('GET', '/stats');
    showToast('↻ Stats refreshed!');
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => {
        document.getElementById('heap').textContent = d.heapUsed + ' MB';
        document.getElementById('heap-bar').style.width = Math.round((d.heapUsed/d.heapTotal)*100) + '%';
        document.getElementById('sys-mem').textContent = d.freeMemMB + ' MB';
        document.getElementById('mem-bar').style.width = Math.round(((d.totalMemMB - d.freeMemMB)/d.totalMemMB)*100) + '%';
        document.getElementById('req-count').textContent = d.requestCount;
      })
      .catch(() => showToast('! Could not fetch live stats.'));
  }

  function copyInfo() {
    const info = \`Node.js App Info
Platform: ${s.platform}/${s.arch}
Node: ${s.nodeVersion}
PID: ${s.pid}
Host: ${s.hostname}
CPU: ${s.cpuModel} (${s.cpuCores} cores)\`;
    navigator.clipboard.writeText(info).then(() => showToast('⎘ Info copied to clipboard!'));
    addLog('SYS', '/copy-info');
  }

  /* ── AUTO-REFRESH every 10s ── */
  setInterval(refreshStats, 10000);
</script>
</body>
</html>`;
};

const server = http.createServer((req, res) => {
  requestCount++;
  requestLog.unshift({ time: new Date().toISOString(), method: req.method, path: req.url });
  if (requestLog.length > 100) requestLog.pop();

  if (req.url === "/api/stats") {
    const s = getServerStats();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ...s, requestCount }));
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(HTML());
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});