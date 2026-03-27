import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  claimStorageKey,
  extractClientIp,
  getNyxConfig,
  getParisParts,
  hashIp,
  isOpenParisWindow,
  parisDateKey
} from './shared/nyx.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const config = getNyxConfig();
const claimsPath = path.join(__dirname, 'data', 'nyx-claims.json');

app.use(express.static(__dirname, { index: false }));

function ensureClaimsFile() {
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });
  if (!fs.existsSync(claimsPath)) {
    fs.writeFileSync(claimsPath, '{}\n', 'utf8');
  }
}

function readClaims() {
  ensureClaimsFile();
  try {
    return JSON.parse(fs.readFileSync(claimsPath, 'utf8'));
  } catch {
    return {};
  }
}

function writeClaims(claims) {
  ensureClaimsFile();
  fs.writeFileSync(claimsPath, `${JSON.stringify(claims, null, 2)}\n`, 'utf8');
}

function getClientIp(req) {
  return extractClientIp(req.headers, req.socket?.remoteAddress || '');
}

app.get('/debug-time', (req, res) => {
  const paris = getParisParts();
  res.json({
    paris: {
      date: `${String(paris.year).padStart(4, '0')}-${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')}`,
      time: `${String(paris.hour).padStart(2, '0')}:${String(paris.minute).padStart(2, '0')}:${String(paris.second).padStart(2, '0')}`
    },
    window: {
      startHour: config.timeWindowParis.start.hour,
      startMinute: config.timeWindowParis.start.minute,
      endHour: config.timeWindowParis.end.hour,
      endMinute: config.timeWindowParis.end.minute,
      open: isOpenParisWindow(config)
    }
  });
});

app.get('/api/nyx-status', (req, res) => {
  const windowOpen = isOpenParisWindow(config);
  if (!windowOpen) {
    return res.json({ showEye: false, windowOpen: false, usedToday: false });
  }

  const ip = getClientIp(req);
  if (!ip) {
    return res.status(400).json({ showEye: false, windowOpen: true, usedToday: true, reason: 'missing-ip' });
  }

  const claims = readClaims();
  const dateKey = parisDateKey();
  const usedToday = Boolean(claims[claimStorageKey(dateKey, hashIp(ip))]);

  return res.json({ showEye: !usedToday, windowOpen: true, usedToday });
});

app.post('/api/nyx-claim', (req, res) => {
  if (!isOpenParisWindow(config)) {
    return res.status(403).json({ error: 'Unavailable' });
  }

  const ip = getClientIp(req);
  if (!ip) {
    return res.status(400).json({ error: 'Missing client IP' });
  }

  const claims = readClaims();
  const dateKey = parisDateKey();
  const key = claimStorageKey(dateKey, hashIp(ip));

  if (claims[key]) {
    return res.status(409).json({ error: 'Already used today' });
  }

  const paris = getParisParts();
  claims[key] = {
    usedAtParis: `${String(paris.year).padStart(4, '0')}-${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')} ${String(paris.hour).padStart(2, '0')}:${String(paris.minute).padStart(2, '0')}:${String(paris.second).padStart(2, '0')}`
  };
  writeClaims(claims);

  return res.json({
    lines: config.nyx.lines,
    solution: config.nyx.solution
  });
});

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Debug time: http://localhost:${port}/debug-time`);
});
