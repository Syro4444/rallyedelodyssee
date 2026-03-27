(function () {
  const STATUS_URL = '/api/nyx-status';
  const CLAIM_URL = '/api/nyx-claim';

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function injectNyxUi(container) {
    if (document.getElementById('nyx-eye')) return;

    const eye = document.createElement('button');
    eye.id = 'nyx-eye';
    eye.type = 'button';
    eye.setAttribute('aria-label', 'Lire le message de Nyx');
    eye.title = 'Observer';
    eye.innerHTML = '<span aria-hidden="true">👁️</span>';

    const overlay = document.createElement('div');
    overlay.id = 'nyx-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div id="nyx-parchment" role="dialog" aria-modal="true" aria-label="Message de Nyx">
        <div id="nyx-content"></div>
      </div>
    `;

    container.appendChild(eye);
    container.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      #nyx-eye{
        margin-top:14px;
        border:2px solid rgba(93,47,10,.55);
        background:rgba(255,255,255,.78);
        border-radius:16px;
        padding:14px 18px;
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:22px;
        line-height:1;
        box-shadow:0 10px 18px rgba(0,0,0,.16);
        transition:transform .18s ease, box-shadow .18s ease, background .25s ease;
      }
      #nyx-eye:hover{ transform:translateY(-2px); box-shadow:0 14px 24px rgba(0,0,0,.18); background:rgba(255,255,255,.9); }
      #nyx-eye:active{ transform:translateY(0); }
      .nyx-status{
        margin-top:14px;
        padding:12px 16px;
        border-radius:12px;
        background:rgba(255,255,255,.82);
        border:1px solid rgba(93,47,10,.25);
        color:#5D2F0A;
        font-family:'GaramondAntique', serif;
        font-size:1.15rem;
        line-height:1.35;
        box-shadow:0 6px 16px rgba(93,47,10,.12);
      }
      #nyx-overlay{
        position:fixed;
        inset:0;
        display:none;
        align-items:center;
        justify-content:center;
        background:radial-gradient(ellipse at center, rgba(0,0,0,.58), rgba(0,0,0,.86));
        z-index:9999;
        padding:24px;
      }
      #nyx-overlay.show{ display:flex; animation:nyxFadeIn .35s ease-out both; }
      @keyframes nyxFadeIn{ from{ opacity:0 } to{ opacity:1 } }
      #nyx-parchment{
        width:min(920px, 92vw);
        max-height:min(86vh, 640px);
        overflow:hidden;
        position:relative;
        border-radius:24px;
        box-shadow:0 30px 80px rgba(0,0,0,.45);
        transform:translateY(10px) scale(.98);
        opacity:0;
        animation:nyxUnfurl .75s cubic-bezier(.2,.9,.2,1) both;
        background:
          radial-gradient(1200px 500px at 20% 10%, rgba(255,255,255,.45), transparent 60%),
          radial-gradient(900px 420px at 80% 20%, rgba(255,255,255,.24), transparent 55%),
          linear-gradient(180deg, rgba(248,238,212,1), rgba(236,221,189,1));
        border:1px solid rgba(93,47,10,.35);
      }
      #nyx-parchment:before{
        content:"";
        position:absolute;
        inset:0;
        background:
          radial-gradient(circle at 20% 30%, rgba(93,47,10,.08), transparent 50%),
          radial-gradient(circle at 80% 60%, rgba(93,47,10,.06), transparent 55%),
          repeating-linear-gradient(0deg, rgba(93,47,10,.035) 0, rgba(93,47,10,.035) 1px, transparent 2px, transparent 6px);
        mix-blend-mode:multiply;
        pointer-events:none;
        opacity:.85;
      }
      #nyx-parchment:after{
        content:"";
        position:absolute;
        inset:-2px;
        border-radius:26px;
        box-shadow:inset 0 0 0 2px rgba(93,47,10,.14), inset 0 0 40px rgba(0,0,0,.10);
        pointer-events:none;
      }
      @keyframes nyxUnfurl{
        0%{ opacity:0; transform:translateY(18px) scale(.965); filter:blur(2px); clip-path:inset(0 50% 0 50% round 24px); }
        55%{ opacity:1; transform:translateY(0) scale(1); filter:blur(0); clip-path:inset(0 0 0 0 round 24px); }
        100%{ opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
      }
      #nyx-content{
        position:relative;
        padding:44px 42px;
        font-family:'GaramondAntique', serif;
        color:#3b1f0a;
        font-size:20px;
        line-height:1.55;
        text-align:left;
        user-select:none;
      }
      @media (max-width: 767px){
        .nyx-status{ font-size:1rem; padding:10px 14px; }
        #nyx-overlay{ padding:14px; }
        #nyx-parchment{ width:min(96vw, 920px); max-height:min(86vh, 640px); border-radius:20px; }
        #nyx-content{ padding:20px 16px 22px; font-size:14px; line-height:1.35; }
      }
      .nyx-line{
        margin:0 0 9px 0;
        will-change:transform, opacity, filter;
      }
      .nyx-solution{
        margin-top:14px;
        text-align:center;
        font-weight:700;
      }
      .nyx-line.vanish{
        animation:nyxLineVanish .55s ease-out forwards;
      }
      @keyframes nyxLineVanish{
        0%{ opacity:1; transform:translateY(0) rotate(0deg); filter:blur(0); }
        55%{ opacity:.35; transform:translateY(-2px) rotate(-1deg); filter:blur(.6px); }
        100%{ opacity:0; transform:translateY(10px) rotate(2deg); filter:blur(2px); }
      }
      #nyx-parchment.burn{ animation:nyxBurnClip 1.35s ease-in forwards; }
      #nyx-parchment.burn .ember{ opacity:1; animation:emberRise 1.1s ease-out forwards; }
      @keyframes nyxBurnClip{
        0%{ clip-path:inset(0 0 0 0 round 24px); filter:drop-shadow(0 0 0 rgba(0,0,0,0)); }
        35%{ filter:drop-shadow(0 0 18px rgba(255,120,0,.25)) drop-shadow(0 0 40px rgba(255,60,0,.12)); }
        100%{ clip-path:inset(0 0 100% 0 round 24px); filter:drop-shadow(0 0 0 rgba(0,0,0,0)); }
      }
      #nyx-parchment .flameband{
        position:absolute;
        left:-10%;
        width:120%;
        height:34%;
        bottom:-34%;
        background:
          radial-gradient(closest-side at 10% 70%, rgba(255,210,120,.9), transparent 70%),
          radial-gradient(closest-side at 30% 80%, rgba(255,140,40,.8), transparent 75%),
          radial-gradient(closest-side at 55% 70%, rgba(255,110,20,.7), transparent 75%),
          radial-gradient(closest-side at 80% 85%, rgba(255,220,140,.8), transparent 75%),
          radial-gradient(closest-side at 95% 65%, rgba(255,120,30,.65), transparent 75%),
          linear-gradient(180deg, rgba(255,120,0,0), rgba(255,90,0,.35), rgba(120,30,0,.18));
        filter:blur(1px) saturate(1.15);
        opacity:0;
        pointer-events:none;
        mix-blend-mode:screen;
      }
      #nyx-parchment.burn .flameband{ opacity:1; animation:flameUp 1.35s ease-in forwards; }
      @keyframes flameUp{ 0%{ transform:translateY(0); } 100%{ transform:translateY(-285%); } }
      .ember{
        position:absolute;
        bottom:8%;
        left:50%;
        width:6px;
        height:6px;
        border-radius:999px;
        background:rgba(255,170,60,.9);
        box-shadow:0 0 12px rgba(255,120,0,.55);
        opacity:0;
        pointer-events:none;
        transform:translateX(-50%);
      }
      @keyframes emberRise{
        0%{ transform:translateX(-50%) translateY(0) scale(1); opacity:1; filter:blur(0); }
        100%{ transform:translateX(-50%) translateY(-110px) scale(.25); opacity:0; filter:blur(1px); }
      }
    `;
    document.head.appendChild(style);

    return { eye, overlay, parchment: overlay.querySelector('#nyx-parchment'), content: overlay.querySelector('#nyx-content') };
  }

  function showStatus(container, message) {
    let status = document.getElementById('nyx-status');
    if (!status) {
      status = document.createElement('div');
      status.id = 'nyx-status';
      status.className = 'nyx-status';
      container.appendChild(status);
    }
    status.textContent = message;
  }

  function buildMessage(lines, solution) {
    const wrapper = document.createElement('div');
    lines.forEach((line) => {
      const item = document.createElement('div');
      item.className = 'nyx-line';
      item.textContent = line;
      wrapper.appendChild(item);
    });

    const solutionLine = document.createElement('div');
    solutionLine.className = 'nyx-line nyx-solution';
    solutionLine.innerHTML = `<strong>${escapeHtml(solution)}</strong>`;
    wrapper.appendChild(solutionLine);
    return wrapper;
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function vanishLinesThenBurn(parchment, content, overlay) {
    const lines = shuffle(Array.from(content.querySelectorAll('.nyx-line')));
    const base = 120;
    lines.forEach((line, index) => {
      const jitter = Math.floor(Math.random() * 40);
      setTimeout(() => line.classList.add('vanish'), index * base + jitter);
    });

    const vanishTotal = lines.length * base + 500;
    setTimeout(() => {
      if (!parchment.querySelector('.flameband')) {
        const flame = document.createElement('div');
        flame.className = 'flameband';
        parchment.appendChild(flame);
        const ember = document.createElement('div');
        ember.className = 'ember';
        parchment.appendChild(ember);
      }
      parchment.classList.add('burn');
    }, vanishTotal + 200);

    setTimeout(() => {
      overlay.classList.remove('show');
      overlay.style.display = 'none';
    }, vanishTotal + 1700);
  }

  async function initNyx() {
    const container = document.querySelector('.container');
    if (!container) return;

    let status;
    try {
      const response = await fetch(STATUS_URL, { credentials: 'same-origin' });
      if (!response.ok) return;
      status = await response.json();
    } catch {
      return;
    }

    if (!status.showEye) return;
    if (status.usedToday) {
      showStatus(container, 'Le message de Nyx a deja ete consulte aujourd hui depuis ce reseau.');
      return;
    }
    if (!status.windowOpen) {
      showStatus(container, 'Le message de Nyx n est pas disponible pour le moment.');
      return;
    }

    const ui = injectNyxUi(container);
    if (!ui) return;

    ui.eye.addEventListener('click', async () => {
      ui.eye.disabled = true;
      ui.eye.style.pointerEvents = 'none';
      ui.eye.style.opacity = '.7';

      let payload;
      try {
        const response = await fetch(CLAIM_URL, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          if (response.status === 409) {
            showStatus(container, 'Le message de Nyx a deja ete consulte aujourd hui depuis ce reseau.');
          } else if (response.status === 403) {
            showStatus(container, 'Le message de Nyx n est plus disponible pour le moment.');
          } else {
            showStatus(container, 'Impossible de recuperer le message de Nyx pour l instant.');
          }
          ui.eye.remove();
          return;
        }

        payload = await response.json();
      } catch {
        showStatus(container, 'Impossible de recuperer le message de Nyx pour l instant.');
        ui.eye.disabled = false;
        ui.eye.style.pointerEvents = '';
        ui.eye.style.opacity = '';
        return;
      }

      ui.eye.style.display = 'none';
      ui.content.innerHTML = '';
      ui.content.appendChild(buildMessage(payload.lines || [], payload.solution || ''));
      ui.overlay.style.display = 'flex';
      ui.overlay.classList.add('show');

      function onKey(event) {
        if (event.key === 'Escape') {
          document.removeEventListener('keydown', onKey);
          ui.overlay.classList.remove('show');
          ui.overlay.style.display = 'none';
        }
      }

      document.addEventListener('keydown', onKey);
      setTimeout(() => vanishLinesThenBurn(ui.parchment, ui.content, ui.overlay), 7000);
    });
  }

  initNyx();
})();
