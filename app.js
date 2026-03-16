const http = require("http");
const os = require("os");

const HTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cloud Computing – Group 1</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #e8f0fe 0%, #f3e8ff 50%, #fce4ec 100%);
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      padding: 60px 24px;
    }

    .wrap { max-width: 760px; margin: auto; }

    .hero {
      background: #fff;
      border-radius: 24px;
      padding: 64px 56px;
      box-shadow: 0 4px 32px rgba(99, 102, 241, 0.1);
      text-align: center;
      margin-bottom: 32px;
    }

    .badge {
      display: inline-block;
      background: #ede9fe;
      color: #6d28d9;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 18px;
      border-radius: 100px;
      margin-bottom: 28px;
    }

    h1 { font-size: 3rem; font-weight: 900; color: #3b82f6; margin-bottom: 12px; letter-spacing: -1px; }

    .sub {
      font-size: 1rem;
      color: #64748b;
      max-width: 480px;
      margin: 0 auto 48px;
      line-height: 1.7;
    }

    .pills { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }

    .pill {
      padding: 8px 20px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      cursor: default;
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .pill:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
    .pill.blue   { background: #dbeafe; color: #1d4ed8; }
    .pill.violet { background: #ede9fe; color: #6d28d9; }
    .pill.green  { background: #dcfce7; color: #15803d; }
    .pill.pink   { background: #fce7f3; color: #be185d; }

    .section {
      background: #fff;
      border-radius: 20px;
      padding: 40px 48px;
      margin-bottom: 24px;
      box-shadow: 0 2px 16px rgba(99, 102, 241, 0.07);
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 24px;
    }

    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }

    .step {
      border-radius: 16px;
      padding: 24px 20px;
      transition: transform 0.18s;
      cursor: default;
    }
    .step:hover { transform: translateY(-4px); }
    .step .icon { font-size: 1.8rem; margin-bottom: 10px; }
    .step h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
    .step p { font-size: 0.82rem; color: #64748b; line-height: 1.5; }
    .step.s1 { background: #eff6ff; }
    .step.s2 { background: #f5f3ff; }
    .step.s3 { background: #f0fdf4; }
    .step.s4 { background: #fdf2f8; }

    .members-grid { display: flex; flex-wrap: wrap; gap: 12px; }

    .member {
      flex: 1 1 120px;
      background: linear-gradient(135deg, #eff6ff, #f5f3ff);
      border: 1.5px solid #c7d2fe;
      border-radius: 14px;
      padding: 18px 16px;
      text-align: center;
      font-weight: 700;
      color: #3730a3;
      font-size: 0.95rem;
      transition: background 0.2s, transform 0.2s;
      cursor: default;
    }
    .member:hover { background: linear-gradient(135deg, #dbeafe, #ede9fe); transform: translateY(-3px); }
    .member span { display: block; font-size: 1.4rem; margin-bottom: 6px; }

    .status-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      flex-wrap: wrap;
      background: #f8fafc;
      border-radius: 14px;
      padding: 18px 28px;
      margin-top: 24px;
      font-size: 13px;
      font-weight: 600;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
    .dot.green  { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
    .dot.blue   { background: #3b82f6; }
    .dot.violet { background: #8b5cf6; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="badge">☁️ Cloud Computing · Group 1</div>
      <h1>AWS Node.js Deploy</h1>
      <p class="sub">Deploy a Node.js application on AWS infrastructure with a <strong>secure</strong> and <strong>scalable</strong> setup — from EC2 provisioning to CI/CD automation.</p>
      <div class="pills">
        <span class="pill blue">EC2 Instance</span>
        <span class="pill violet">IAM Security</span>
        <span class="pill green">Auto Scaling</span>
        <span class="pill pink">CI/CD Pipeline</span>
        <span class="pill blue">Load Balancer</span>
        <span class="pill violet">Node.js App</span>
      </div>
      <div class="status-bar">
        <span><span class="dot green"></span>Server Live · Port 3000</span>
        <span><span class="dot blue"></span>AWS Deployed</span>
        <span><span class="dot violet"></span>CI/CD Active</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Project Highlights</div>
      <div class="steps">
        <div class="step s1">
          <div class="icon">🖥️</div>
          <h3>EC2 Setup</h3>
          <p>Launch & configure a secure EC2 instance with proper security groups.</p>
        </div>
        <div class="step s2">
          <div class="icon">🔐</div>
          <h3>IAM & Security</h3>
          <p>Least-privilege IAM roles, SSL/TLS, and environment variable management.</p>
        </div>
        <div class="step s3">
          <div class="icon">⚡</div>
          <h3>Scalability</h3>
          <p>Elastic Load Balancer with Auto Scaling Groups for high availability.</p>
        </div>
        <div class="step s4">
          <div class="icon">🚀</div>
          <h3>CI/CD</h3>
          <p>Automated deploy pipeline via GitHub Actions on every push to main.</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Team Members</div>
      <div class="members-grid">
        <div class="member"><span>👨‍💻</span>Milind</div>
        <div class="member"><span>👩‍💻</span>Shreya</div>
        <div class="member"><span>👨‍💻</span>Meet</div>
        <div class="member"><span>👩‍💻</span>Atmaja</div>
      </div>
    </div>
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