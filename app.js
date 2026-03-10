const http = require("http");
const os = require("os");

const HTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cloud Computing – Group 1</title>
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: #fff7ed;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Nunito', sans-serif;
      padding: 40px 20px;
    }

    .card {
      background: #ffffff;
      border-radius: 28px;
      padding: 56px 52px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(255, 120, 30, 0.15);
      text-align: center;
      border: 3px solid #ffb347;
    }

    .subject-badge {
      display: inline-block;
      background: #ff6b35;
      color: #fff;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 7px 20px;
      border-radius: 100px;
      margin-bottom: 28px;
    }

    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 2.6rem;
      color: #ff6b35;
      line-height: 1.2;
      margin-bottom: 10px;
    }

    .tagline {
      color: #f0a500;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 40px;
      letter-spacing: 1px;
    }

    .divider {
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, #ff6b35, #ffb347, #ffd166);
      margin-bottom: 36px;
    }

    .group-label {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #ffb347;
      margin-bottom: 18px;
    }

    .members {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .member {
      background: #fff3e0;
      border: 2px solid #ffb347;
      color: #e65100;
      font-size: 1.05rem;
      font-weight: 900;
      padding: 12px 24px;
      border-radius: 14px;
      transition: transform 0.2s, background 0.2s;
    }

    .member:hover {
      background: #ff6b35;
      color: #fff;
      transform: translateY(-3px);
      border-color: #ff6b35;
    }

    footer {
      margin-top: 40px;
      font-size: 12px;
      color: #ffb347;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .cicd {
      margin-top: 14px;
      font-size: 14px;
      font-weight: 900;
      color: #27ae60;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="subject-badge">☁️ Cloud Computing</div>
    <h1>Group 1</h1>
    <p class="tagline">Hello from AWS and Group 1 🚀 — Port 3000</p>
    <div class="divider"></div>
    <div class="group-label">Members</div>
    <div class="members">
      <div class="member">Milind</div>
      <div class="member">Shreya</div>
      <div class="member">Meet</div>
      <div class="member">Atmaja</div>
    </div>
    <footer>Running on Node.js · AWS Deployed</footer>
    <div class="cicd">✅ CI/CD is Running</div>
  </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(HTML());
});

const PORT = 3000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});