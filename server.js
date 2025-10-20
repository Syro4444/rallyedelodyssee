import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets at root
app.use(express.static(__dirname, { index: false }));

function loadConfigOrDefault() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw);
    const start = parsed?.timeWindowParis?.start;
    const end = parsed?.timeWindowParis?.end;
    const enableSecretLink = parsed?.enableSecretLink !== false; // default to true if not specified
    if (
      start && end &&
      Number.isInteger(start.hour) && Number.isInteger(start.minute) &&
      Number.isInteger(end.hour) && Number.isInteger(end.minute)
    ) {
      return { 
        startHour: start.hour, 
        startMinute: start.minute, 
        endHour: end.hour, 
        endMinute: end.minute,
        enableSecretLink: enableSecretLink
      };
    }
  } catch (e) {
    // fall back below
  }
  // Default to 14:42–14:45 Europe/Paris with secret link enabled
  return { startHour: 14, startMinute: 42, endHour: 14, endMinute: 45, enableSecretLink: true };
}

const timeWindow = loadConfigOrDefault();

function isOpenParisWindow(hStart, mStart, hEnd, mEnd) {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  const parts = fmt.formatToParts(now);
  const hourPart = parts.find(p => p.type === 'hour');
  const minutePart = parts.find(p => p.type === 'minute');
  const h = parseInt(hourPart ? hourPart.value : '0', 10);
  const m = parseInt(minutePart ? minutePart.value : '0', 10);
  const cur = h * 60 + m;
  const start = hStart * 60 + mStart;
  const end = hEnd * 60 + mEnd;
  return cur >= start && cur < end;
}

// Homepage: stream index.html and inject the special link during the window
app.get(['/', '/index.html'], (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  if (timeWindow.enableSecretLink && isOpenParisWindow(timeWindow.startHour, timeWindow.startMinute, timeWindow.endHour, timeWindow.endMinute)) {
    // append the link inside the .container div
    html = html.replace(
      /(<div class=\"container\"[\s\S]*?>)/,
      `$1\n    <div class=\"special\" style=\"display:block;margin:10px 0;padding:12px 18px;border-radius:10px;border:1px solid gold;background:gold;color:#111;font-weight:600;cursor:pointer;position:relative\" onmouseover=\"this.querySelector('.hidden-text').style.display='block'\" onmouseout=\"this.querySelector('.hidden-text').style.display='none'\" ontouchstart=\"this.querySelector('.hidden-text').style.display='block'\" ontouchend=\"this.querySelector('.hidden-text').style.display='none'\">✨ Nyx vous salue, voyageurs de la nuit<div class=\"hidden-text\" style=\"display:none;margin-top:8px;font-size:18px;color:#8B4513;font-style:italic\">Ἀστερία</div></div>`
    );
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Special route: only serve during window
app.get('/special', (req, res, next) => {
  if (!isOpenParisWindow(timeWindow.startHour, timeWindow.startMinute, timeWindow.endHour, timeWindow.endMinute)) {
    // Outside window -> pretend not found
    return res.status(404).send('Not Found');
  }
  const specialPath = path.join(__dirname, 'special.html');
  if (fs.existsSync(specialPath)) {
    res.sendFile(specialPath);
  } else {
    res.status(404).send('Not Found');
  }
});

// Fallback for other assets and routes
app.use((req, res) => {
  const assetPath = path.join(__dirname, req.path);
  if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    return res.sendFile(assetPath);
  }
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
