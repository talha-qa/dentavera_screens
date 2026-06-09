const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SCREENS_DIR = path.join(__dirname, 'screens');

const screens = [
  // ── ADMIN ──
  { id: 'dv_01_login',           file: 'dv_01_login.html',           label: 'Login',              group: 'Shared' },
  { id: 'dv_02_admin_dashboard', file: 'dv_02_admin_dashboard.html', label: 'Dashboard',          group: 'Admin' },
  { id: 'dv_03_team',            file: 'dv_03_team.html',            label: 'Team',               group: 'Admin' },
  { id: 'dv_04_usage_metrics',   file: 'dv_04_usage_metrics.html',   label: 'Usage Metrics',      group: 'Admin' },
  { id: 'dv_05_billing',         file: 'dv_05_billing.html',         label: 'Billing',            group: 'Admin' },
  { id: 'dv_06_org_settings',    file: 'dv_06_org_settings.html',    label: 'Org Settings',       group: 'Admin' },
  // ── USER ──
  { id: 'dv_u02_user_dashboard', file: 'dv_u02_user_dashboard.html', label: 'Dashboard',          group: 'User' },
  { id: 'dv_u03_upload',         file: 'dv_u03_upload.html',         label: 'Upload Image',       group: 'User' },
  { id: 'dv_u04_sim_select',     file: 'dv_u04_sim_select.html',     label: 'Select Simulation',  group: 'User' },
  { id: 'dv_u05_processing',     file: 'dv_u05_processing.html',     label: 'Processing',         group: 'User' },
  { id: 'dv_u06_result',         file: 'dv_u06_result.html',         label: 'Result',             group: 'User' },
  { id: 'dv_u07_compare',        file: 'dv_u07_compare.html',        label: 'Compare',            group: 'User' },
  { id: 'dv_u08_history',        file: 'dv_u08_history.html',        label: 'My Simulations',     group: 'User' },
  { id: 'dv_u09_profile',        file: 'dv_u09_profile.html',        label: 'Profile',            group: 'User' },
];

function buildShell(activeId) {
  const groups = [...new Set(screens.map(s => s.group))];

  const navItems = groups.map(group => {
    const items = screens
      .filter(s => s.group === group)
      .map(s => {
        const isActive = s.id === activeId;
        return `<a href="/${s.id}" class="nav-item ${isActive ? 'active' : ''}">${s.label}</a>`;
      }).join('');
    return `
      <div class="nav-group">
        <div class="nav-group-label">${group}</div>
        ${items}
      </div>`;
  }).join('');

  const activeScreen = screens.find(s => s.id === activeId) || screens[0];
  const total = screens.length;
  const idx = screens.findIndex(s => s.id === activeId);
  const prev = screens[idx - 1];
  const next = screens[idx + 1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>DentaVera — ${activeScreen.label}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0d1117; display: flex; height: 100vh; overflow: hidden; }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 220px;
      flex-shrink: 0;
      background: #161b22;
      border-right: 1px solid rgba(255,255,255,0.07);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .sidebar-brand {
      padding: 20px 18px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      width: 28px; height: 28px;
      background: #2563ff;
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: #fff;
      flex-shrink: 0;
    }
    .brand-name { font-size: 13px; font-weight: 600; color: #fff; letter-spacing: -0.2px; }
    .brand-sub  { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }
    .nav-group { padding: 8px 0; }
    .nav-group-label {
      font-size: 9px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.2);
      padding: 10px 18px 5px;
    }
    .nav-item {
      display: block;
      padding: 7px 18px;
      font-size: 12px; color: rgba(255,255,255,0.4);
      text-decoration: none;
      border-left: 2px solid transparent;
      transition: color 0.12s, background 0.12s;
    }
    .nav-item:hover  { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.04); }
    .nav-item.active { color: #fff; border-left-color: #2563ff; background: rgba(37,99,255,0.1); }
    .sidebar-footer {
      margin-top: auto;
      padding: 14px 18px;
      border-top: 1px solid rgba(255,255,255,0.07);
      font-size: 10px; color: rgba(255,255,255,0.2);
    }

    /* ── MAIN ── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── TOPBAR ── */
    .topbar {
      height: 48px;
      background: #161b22;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      flex-shrink: 0;
    }
    .topbar-left { display: flex; align-items: center; gap: 8px; }
    .screen-badge {
      font-size: 10px; font-weight: 600;
      background: rgba(37,99,255,0.15);
      color: #5b8fff;
      padding: 3px 9px; border-radius: 100px;
    }
    .screen-title { font-size: 13px; font-weight: 500; color: #fff; }
    .screen-group { font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 2px; }
    .topbar-right { display: flex; align-items: center; gap: 8px; }
    .nav-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 7px;
      padding: 5px 12px;
      font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.6);
      font-family: 'Inter', sans-serif;
      cursor: pointer; text-decoration: none;
      display: inline-flex; align-items: center; gap: 5px;
      transition: background 0.12s, color 0.12s;
    }
    .nav-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .nav-btn.disabled { opacity: 0.25; pointer-events: none; }
    .counter { font-size: 11px; color: rgba(255,255,255,0.25); padding: 0 4px; }

    /* ── FRAME ── */
    .frame-wrap {
      flex: 1;
      overflow: auto;
      padding: 24px;
      background: #0d1117;
    }
    .screen-frame {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      min-height: 500px;
    }
  </style>
</head>
<body>

  <nav class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">✦</div>
      <div>
        <div class="brand-name">DentaVera</div>
        <div class="brand-sub">Design Preview</div>
      </div>
    </div>
    ${navItems}
    <div class="sidebar-footer">${total} screens total</div>
  </nav>

  <div class="main">
    <div class="topbar">
      <div class="topbar-left">
        <span class="screen-badge">${activeScreen.group}</span>
        <span class="screen-title">${activeScreen.label}</span>
      </div>
      <div class="topbar-right">
        <a href="${prev ? '/' + prev.id : '#'}" class="nav-btn ${!prev ? 'disabled' : ''}">← Prev</a>
        <span class="counter">${idx + 1} / ${total}</span>
        <a href="${next ? '/' + next.id : '#'}" class="nav-btn ${!next ? 'disabled' : ''}">Next →</a>
      </div>
    </div>
    <div class="frame-wrap">
      <div class="screen-frame">
        __SCREEN_CONTENT__
      </div>
    </div>
  </div>

</body>
</html>`;
}

// Route: root → first screen
app.get('/', (req, res) => res.redirect('/' + screens[0].id));

// Route: each screen
screens.forEach(screen => {
  app.get('/' + screen.id, (req, res) => {
    const filePath = path.join(SCREENS_DIR, screen.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Screen file not found: ' + screen.file);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const shell = buildShell(screen.id).replace('__SCREEN_CONTENT__', content);
    res.send(shell);
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ✦  DentaVera Design Preview');
  console.log('  ─────────────────────────────');
  console.log(`  Running at → http://localhost:${PORT}`);
  console.log(`  ${screens.length} screens loaded`);
  console.log('');
});
