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
    const enableSecretLink = parsed?.enableSecretLink !== false; // default true

    // Optional: message config
    const nyx = parsed?.nyx || {};
    const nyxLines = Array.isArray(nyx.lines) ? nyx.lines.map(String) : null;
    const nyxSolution = typeof nyx.solution === 'string' ? nyx.solution : 'Ἀστερία';

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
        enableSecretLink,
        nyx: {
          lines: nyxLines || [
            "Nyx vous félicite, voyageurs, pour la ténacité dont vous faites preuve.",
            "Chaque indice arraché à l’ombre est une victoire sur le doute.",
            "Vous avez suivi les traces, recollé les fragments, et tenu bon.",
            "Votre curiosité éclaire la route quand la nuit se fait plus dense.",
            "Vous avez su écouter les silences autant que les signes.",
            "Les obstacles n’ont fait que renforcer votre cohésion.",
            "Continuez : l’Odyssée récompense les esprits patients.",
            "Que votre courage reste vif, même lorsque tout semble se taire.",
            "La déesse vous observe… et sourit à vos efforts.",
            "Avancez, et laissez derrière vous les cendres de l’hésitation."
          ],
          solution: nyxSolution
        }
      };
    }
  } catch (e) {
    // fall back below
  }

  return {
    startHour: 14,
    startMinute: 42,
    endHour: 14,
    endMinute: 45,
    enableSecretLink: true,
    nyx: {
      lines: [
        "Nyx vous félicite, voyageurs, pour la ténacité dont vous faites preuve.",
        "Chaque indice arraché à l’ombre est une victoire sur le doute.",
        "Vous avez suivi les traces, recollé les fragments, et tenu bon.",
        "Votre curiosité éclaire la route quand la nuit se fait plus dense.",
        "Vous avez su écouter les silences autant que les signes.",
        "Les obstacles n’ont fait que renforcer votre cohésion.",
        "Continuez : l’Odyssée récompense les esprits patients.",
        "Que votre courage reste vif, même lorsque tout semble se taire.",
        "La déesse vous observe… et sourit à vos efforts.",
        "Avancez, et laissez derrière vous les cendres de l’hésitation."
      ],
      solution: "Ἀστερία"
    }
  };
}

const cfg = loadConfigOrDefault();

function getParisParts(now = new Date()) {
  // If the runtime doesn't have full ICU tz data, Intl can throw.
  // We fall back to local time and expose it via /debug-time.
  try {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const parts = fmt.formatToParts(now);
    const get = (t) => (parts.find(p => p.type === t)?.value);
    return {
      ok: true,
      year: parseInt(get('year') || '0', 10),
      month: parseInt(get('month') || '0', 10),
      day: parseInt(get('day') || '0', 10),
      hour: parseInt(get('hour') || '0', 10),
      minute: parseInt(get('minute') || '0', 10),
      second: parseInt(get('second') || '0', 10)
    };
  } catch (e) {
    return {
      ok: false,
      reason: String(e && e.message ? e.message : e),
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };
  }
}

function isOpenParisWindow(hStart, mStart, hEnd, mEnd) {
  const p = getParisParts(new Date());
  const cur = p.hour * 60 + p.minute;
  const start = hStart * 60 + mStart;
  const end = hEnd * 60 + mEnd;
  return cur >= start && cur < end;
}

// ✅ Debug endpoint
app.get('/debug-time', (req, res) => {
  const p = getParisParts(new Date());
  const open = cfg.enableSecretLink && isOpenParisWindow(cfg.startHour, cfg.startMinute, cfg.endHour, cfg.endMinute);
  res.json({
    paris: {
      ok: p.ok,
      reason: p.ok ? undefined : p.reason,
      date: `${String(p.year).padStart(4,'0')}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`,
      time: `${String(p.hour).padStart(2,'0')}:${String(p.minute).padStart(2,'0')}:${String(p.second).padStart(2,'0')}`
    },
    window: {
      start: `${String(cfg.startHour).padStart(2,'0')}:${String(cfg.startMinute).padStart(2,'0')}`,
      end: `${String(cfg.endHour).padStart(2,'0')}:${String(cfg.endMinute).padStart(2,'0')}`
    },
    open,
    notes: [
      "If open=false, the 👁️ won't be injected.",
      "If paris.ok=false, your Node build may lack ICU tz data; the server fell back to local time."
    ]
  });
});

// Homepage: serve index.html and inject the 👁️ during the window
app.get(['/', '/index.html'], (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  if (cfg.enableSecretLink && isOpenParisWindow(cfg.startHour, cfg.startMinute, cfg.endHour, cfg.endMinute)) {
    const nyxLines = JSON.stringify(cfg.nyx.lines);
    const nyxSolution = JSON.stringify(cfg.nyx.solution);

    html = html.replace(
      /(<div class=\"container\"[\s\S]*?>)/,
      `$1
    <button id="nyx-eye" type="button" aria-label="Lire le message de Nyx" title="Observer">
      <span aria-hidden="true">👁️</span>
    </button>

    <div id="nyx-overlay" aria-hidden="true">
      <div id="nyx-parchment" role="dialog" aria-modal="true" aria-label="Message de Nyx">
        <div id="nyx-content"></div>
      </div>
    </div>

    <style>
      /* Eye button */
      #nyx-eye{
        margin-top:14px;
        border: 2px solid rgba(93,47,10,.55);
        background: rgba(255,255,255,.78);
        border-radius: 16px;
        padding: 14px 18px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        line-height: 1;
        box-shadow: 0 10px 18px rgba(0,0,0,.16);
        transition: transform .18s ease, box-shadow .18s ease, background .25s ease;
      }
      #nyx-eye:hover{ transform: translateY(-2px); box-shadow: 0 14px 24px rgba(0,0,0,.18); background: rgba(255,255,255,.9); }
      #nyx-eye:active{ transform: translateY(0px); }

      /* Fullscreen overlay */
      #nyx-overlay{
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: radial-gradient(ellipse at center, rgba(0,0,0,.58), rgba(0,0,0,.86));
        z-index: 9999;
        padding: 24px;
      }
      #nyx-overlay.show{ display:flex; animation: nyxFadeIn .35s ease-out both; }
      @keyframes nyxFadeIn{ from{ opacity:0 } to{ opacity:1 } }

      /* Parchment */
      #nyx-parchment{
        width: min(920px, 92vw);
        max-height: min(88vh, 720px);
        overflow: hidden;
        position: relative;
        border-radius: 24px;
        box-shadow: 0 30px 80px rgba(0,0,0,.45);
        transform: translateY(10px) scale(.98);
        opacity: 0;
        animation: nyxUnfurl .75s cubic-bezier(.2,.9,.2,1) both;
        background:
          radial-gradient(1200px 500px at 20% 10%, rgba(255,255,255,.45), transparent 60%),
          radial-gradient(900px 420px at 80% 20%, rgba(255,255,255,.24), transparent 55%),
          linear-gradient(180deg, rgba(248,238,212,1), rgba(236,221,189,1));
        border: 1px solid rgba(93,47,10,.35);
      }

      /* texture + vignette */
      #nyx-parchment:before{
        content:"";
        position:absolute; inset:0;
        background:
          radial-gradient(circle at 20% 30%, rgba(93,47,10,.08), transparent 50%),
          radial-gradient(circle at 80% 60%, rgba(93,47,10,.06), transparent 55%),
          repeating-linear-gradient(0deg, rgba(93,47,10,.035) 0, rgba(93,47,10,.035) 1px, transparent 2px, transparent 6px);
        mix-blend-mode: multiply;
        pointer-events:none;
        opacity:.85;
      }
      #nyx-parchment:after{
        content:"";
        position:absolute; inset:-2px;
        border-radius: 26px;
        box-shadow: inset 0 0 0 2px rgba(93,47,10,.14), inset 0 0 40px rgba(0,0,0,.10);
        pointer-events:none;
      }

      @keyframes nyxUnfurl{
        0%{ opacity:0; transform: translateY(18px) scale(.965); filter: blur(2px); clip-path: inset(0 50% 0 50% round 24px); }
        55%{ opacity:1; transform: translateY(0px) scale(1); filter: blur(0px); clip-path: inset(0 0 0 0 round 24px); }
        100%{ opacity:1; transform: translateY(0px) scale(1); filter: blur(0px); }
      }

      #nyx-content{
        position: relative;
        padding: 44px 42px;
        font-family: 'GaramondAntique', serif;
        color: #3b1f0a;
        font-size: 22px;
        line-height: 1.55;
        text-align: left;
        user-select: none;
      }
      @media (max-width: 767px){
        #nyx-content{ padding: 30px 24px; font-size: 18px; }
      }

      .nyx-line{ margin: 0 0 10px 0; }
      .nyx-word{
        display: inline-block;
        will-change: transform, opacity, filter;
      }
      .nyx-word.vanish{
        animation: nyxWordVanish .55s ease-out forwards;
      }
      @keyframes nyxWordVanish{
        0%{ opacity:1; transform: translateY(0) rotate(0deg); filter: blur(0px); }
        55%{ opacity:.35; transform: translateY(-2px) rotate(-1deg); filter: blur(.6px); }
        100%{ opacity:0; transform: translateY(10px) rotate(2deg); filter: blur(2px); }
      }

      /* Burn from bottom: eats upwards */
      #nyx-parchment.burn{
        animation: nyxBurnClip 1.35s ease-in forwards;
      }
      #nyx-parchment.burn .ember{
        opacity: 1;
        animation: emberRise 1.1s ease-out forwards;
      }

      @keyframes nyxBurnClip{
        0%{ clip-path: inset(0 0 0 0 round 24px); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
        35%{ filter: drop-shadow(0 0 18px rgba(255,120,0,.25)) drop-shadow(0 0 40px rgba(255,60,0,.12)); }
        100%{ clip-path: inset(0 0 100% 0 round 24px); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
      }

      /* animated flame band */
      #nyx-parchment .flameband{
        position:absolute;
        left:-10%;
        width:120%;
        height: 34%;
        bottom: -34%;
        background:
          radial-gradient(closest-side at 10% 70%, rgba(255,210,120,.9), transparent 70%),
          radial-gradient(closest-side at 30% 80%, rgba(255,140,40,.8), transparent 75%),
          radial-gradient(closest-side at 55% 70%, rgba(255,110,20,.7), transparent 75%),
          radial-gradient(closest-side at 80% 85%, rgba(255,220,140,.8), transparent 75%),
          radial-gradient(closest-side at 95% 65%, rgba(255,120,30,.65), transparent 75%),
          linear-gradient(180deg, rgba(255,120,0,.0), rgba(255,90,0,.35), rgba(120,30,0,.18));
        filter: blur(1px) saturate(1.15);
        opacity: 0;
        pointer-events:none;
        mix-blend-mode: screen;
      }
      #nyx-parchment.burn .flameband{
        opacity: 1;
        animation: flameUp 1.35s ease-in forwards;
      }
      @keyframes flameUp{
        0%{ transform: translateY(0); }
        100%{ transform: translateY(-285%); }
      }

      .ember{
        position:absolute;
        bottom: 8%;
        left: 50%;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: rgba(255,170,60,.9);
        box-shadow: 0 0 12px rgba(255,120,0,.55);
        opacity: 0;
        pointer-events:none;
        transform: translateX(-50%);
      }
      @keyframes emberRise{
        0%{ transform: translateX(-50%) translateY(0) scale(1); opacity:1; filter: blur(0px); }
        100%{ transform: translateX(-50%) translateY(-110px) scale(.25); opacity:0; filter: blur(1px); }
      }
    </style>

    <script>
      (function(){
        const LINES = ${nyxLines};
        const SOLUTION = ${nyxSolution};

        function parisISODate(){
          try{
            const fmt = new Intl.DateTimeFormat('fr-FR', { timeZone:'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit' });
            const parts = fmt.formatToParts(new Date());
            const get = (t)=>parts.find(p=>p.type===t)?.value;
            return get('year') + '-' + get('month') + '-' + get('day');
          }catch(e){
            const d = new Date();
            const mm = String(d.getMonth()+1).padStart(2,'0');
            const dd = String(d.getDate()).padStart(2,'0');
            return d.getFullYear() + '-' + mm + '-' + dd;
          }
        }

        const KEY = 'nyx_eye_used_' + parisISODate();

        const eye = document.getElementById('nyx-eye');
        const overlay = document.getElementById('nyx-overlay');
        const parchment = document.getElementById('nyx-parchment');
        const content = document.getElementById('nyx-content');

        // If already used today, hide button
        try{
          if(localStorage.getItem(KEY) === '1'){
            eye.style.display = 'none';
            return;
          }
        }catch(e){ /* ignore */ }

        function buildMessage(){
          // Build 10 lines + solution bold on last line (append)
          const lines = LINES.slice(0, 10);
          const last = lines[lines.length-1];
          lines[lines.length-1] = last + ' ' + '<strong>' + escapeHtml(SOLUTION) + '</strong>';

          const wrapper = document.createElement('div');

          for(const ln of lines){
            const p = document.createElement('div');
            p.className = 'nyx-line';
            // Convert line to tokens (keep tags like <strong>)
            p.innerHTML = tokenizeIntoSpans(ln);
            wrapper.appendChild(p);
          }
          return wrapper;
        }

        function escapeHtml(s){
          return String(s)
            .replaceAll('&','&amp;')
            .replaceAll('<','&lt;')
            .replaceAll('>','&gt;')
            .replaceAll('"','&quot;')
            .replaceAll("'","&#039;");
        }

        // Wrap every word in <span class="nyx-word">…</span> but preserve <strong>…</strong>
        function tokenizeIntoSpans(htmlLine){
          const tmp = document.createElement('div');
          tmp.innerHTML = htmlLine;

          function wrapTextNode(node){
            const text = node.nodeValue;
            const parts = text.split(/(\s+)/); // keep spaces
            const frag = document.createDocumentFragment();
            for(const part of parts){
              if(part.trim() === ''){
                frag.appendChild(document.createTextNode(part));
              }else{
                const sp = document.createElement('span');
                sp.className = 'nyx-word';
                sp.textContent = part;
                frag.appendChild(sp);
              }
            }
            node.replaceWith(frag);
          }

          // Walk nodes and wrap text nodes unless inside script/style (none)
          const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_TEXT, null);
          const textNodes = [];
          while(walker.nextNode()) textNodes.push(walker.currentNode);
          for(const tn of textNodes) wrapTextNode(tn);

          return tmp.innerHTML;
        }

        function shuffle(arr){
          for(let i=arr.length-1;i>0;i--){
            const j = Math.floor(Math.random()*(i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        }

        function vanishWordsThenBurn(){
          const words = Array.from(content.querySelectorAll('.nyx-word'));
          shuffle(words);

          // Stagger vanish with random jitter
          const base = 18; // ms
          words.forEach((w, i)=>{
            const jitter = Math.floor(Math.random()*40);
            setTimeout(()=> w.classList.add('vanish'), i*base + jitter);
          });

          const vanishTotal = words.length*base + 500;

          // Burn after words mostly gone
          setTimeout(()=>{
            // Add flame elements once
            if(!parchment.querySelector('.flameband')){
              const flame = document.createElement('div');
              flame.className = 'flameband';
              parchment.appendChild(flame);
              const ember = document.createElement('div');
              ember.className = 'ember';
              parchment.appendChild(ember);
            }
            parchment.classList.add('burn');
          }, vanishTotal + 200);

          // Remove overlay after burn finishes
          setTimeout(()=>{
            overlay.classList.remove('show');
            overlay.style.display = 'none';
          }, vanishTotal + 1700);
        }

        eye.addEventListener('click', ()=>{
          // One click only
          eye.disabled = true;
          eye.style.pointerEvents = 'none';
          eye.style.opacity = '.7';

          try{ localStorage.setItem(KEY, '1'); }catch(e){ /* ignore */ }

          // Hide eye immediately to avoid double interaction
          eye.style.display = 'none';

          // Build and show parchment
          content.innerHTML = '';
          content.appendChild(buildMessage());

          overlay.style.display = 'flex';
          overlay.classList.add('show');

          // Close with ESC (optional)
          function onKey(e){
            if(e.key === 'Escape'){
              document.removeEventListener('keydown', onKey);
              overlay.classList.remove('show');
              overlay.style.display = 'none';
            }
          }
          document.addEventListener('keydown', onKey);

          // Start disappearance: words vanish randomly, then burn from bottom
          setTimeout(()=> vanishWordsThenBurn(), 1000);
        });
      })();
    </script>`
    );
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Special route: only serve during window
app.get('/special', (req, res) => {
  if (!isOpenParisWindow(cfg.startHour, cfg.startMinute, cfg.endHour, cfg.endMinute)) {
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
  console.log(`Debug time: http://localhost:${port}/debug-time`);
});
