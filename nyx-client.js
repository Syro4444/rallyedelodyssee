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

    document.body.classList.add('nyx-night');

    const eye = document.createElement('button');
    eye.id = 'nyx-eye';
    eye.type = 'button';
    eye.setAttribute('aria-label', 'Lire le message de Nyx');
    eye.title = 'Observer';
    eye.innerHTML = `
      <span class="nyx-glow"></span>
      <span class="nyx-spark nyx-spark-a" aria-hidden="true">✦</span>
      <span class="nyx-spark nyx-spark-b" aria-hidden="true">✦</span>
      <span class="nyx-spark nyx-spark-c" aria-hidden="true">✦</span>
      <span class="nyx-eye-glyph" aria-hidden="true">👁️</span>
    `;

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
      body.nyx-night::before{
        content:"";
        position:fixed;
        inset:0;
        background:
          radial-gradient(circle at 50% 18%, rgba(74,92,130,.18), transparent 34%),
          linear-gradient(180deg, rgba(6,10,20,.44), rgba(8,12,22,.56));
        pointer-events:none;
        z-index:0;
      }
      body.nyx-night .container{
        position:relative;
        z-index:1;
      }
      #nyx-eye{
        position:relative;
        margin-top:14px;
        border:1px solid rgba(145,98,32,.65);
        background:
          radial-gradient(circle at 30% 30%, rgba(255,255,255,.98), rgba(255,244,210,.95) 45%, rgba(226,194,128,.88) 100%);
        border-radius:18px;
        padding:16px 22px;
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:24px;
        line-height:1;
        box-shadow:
          0 10px 18px rgba(0,0,0,.16),
          0 0 0 1px rgba(255,245,214,.9) inset,
          0 0 22px rgba(255,222,125,.55);
        transition:transform .18s ease, box-shadow .18s ease, background .25s ease, filter .25s ease;
        overflow:visible;
      }
      #nyx-eye:hover{
        transform:translateY(-2px) scale(1.03);
        box-shadow:
          0 14px 24px rgba(0,0,0,.18),
          0 0 0 1px rgba(255,248,226,.95) inset,
          0 0 30px rgba(255,228,138,.78);
        filter:brightness(1.05);
      }
      #nyx-eye:active{ transform:translateY(0); }
      .nyx-eye-glyph{
        position:relative;
        z-index:2;
        filter:drop-shadow(0 0 10px rgba(255,235,160,.7));
      }
      .nyx-glow{
        position:absolute;
        inset:-8px;
        border-radius:24px;
        background:radial-gradient(circle, rgba(255,240,174,.5), rgba(255,240,174,0) 72%);
        z-index:0;
        pointer-events:none;
      }
      .nyx-spark{
        position:absolute;
        z-index:1;
        color:#fff4c1;
        text-shadow:0 0 10px rgba(255,231,144,.95);
        animation:nyxTwinkle 1.9s ease-in-out infinite;
        pointer-events:none;
      }
      .nyx-spark-a{ top:-10px; right:-6px; font-size:15px; animation-delay:0s; }
      .nyx-spark-b{ top:6px; left:-12px; font-size:12px; animation-delay:.45s; }
      .nyx-spark-c{ bottom:-8px; right:8px; font-size:13px; animation-delay:.9s; }
      @keyframes nyxTwinkle{
        0%, 100%{ opacity:.35; transform:scale(.8) rotate(0deg); }
        50%{ opacity:1; transform:scale(1.2) rotate(12deg); }
      }
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
        z-index:2;
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
      .nyx-word{
        display:inline-block;
        white-space:pre;
        will-change:transform, opacity, filter;
      }
      .nyx-solution{
        margin-top:14px;
        text-align:center;
        font-weight:700;
      }
      .nyx-solution strong{
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 1.15em;
        letter-spacing: .02em;
      }
      .nyx-word.vanish{
        animation:nyxWordVanish .55s ease-out forwards;
      }
      @keyframes nyxWordVanish{
        0%{ opacity:1; transform:translateY(0) rotate(0deg); filter:blur(0); }
        55%{ opacity:.35; transform:translateY(-2px) rotate(-1deg); filter:blur(.6px); }
        100%{ opacity:0; transform:translateY(10px) rotate(2deg); filter:blur(2px); }
      }
      #nyx-parchment.burn{
        animation:
          nyxBurnClip 2.2s ease-in forwards,
          nyxShake .12s ease-in-out 10 alternate;
      }
      #nyx-parchment.burn::before{
        animation:nyxScorch 1.6s ease-in forwards;
      }
      #nyx-parchment.burn::after{
        animation:nyxHeatGlow 1.2s ease-in forwards;
      }
      #nyx-parchment.burn .ember{ opacity:1; animation:emberRise 1.1s ease-out forwards; }
      @keyframes nyxBurnClip{
        0%{ clip-path:inset(0 0 0 0 round 24px); filter:drop-shadow(0 0 0 rgba(0,0,0,0)); }
        40%{ filter:drop-shadow(0 0 18px rgba(255,120,0,.25)) drop-shadow(0 0 40px rgba(255,60,0,.12)); }
        100%{ clip-path:inset(0 0 100% 0 round 24px); filter:drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(.7); }
      }
      @keyframes nyxShake{
        from{ transform:translateY(0) rotate(-.25deg); }
        to{ transform:translateY(0) rotate(.25deg); }
      }
      @keyframes nyxScorch{
        0%{ opacity:.85; filter:brightness(1) saturate(1); }
        45%{ opacity:.98; filter:brightness(.88) saturate(1.3); }
        100%{ opacity:1; filter:brightness(.42) saturate(.62); }
      }
      @keyframes nyxHeatGlow{
        0%{
          box-shadow:
            inset 0 0 0 2px rgba(93,47,10,.14),
            inset 0 0 40px rgba(0,0,0,.10);
        }
        45%{
          box-shadow:
            inset 0 0 0 2px rgba(255,180,110,.55),
            inset 0 -45px 65px rgba(255,110,20,.45),
            inset 0 0 40px rgba(0,0,0,.18),
            0 0 22px rgba(255,120,0,.24);
        }
        100%{
          box-shadow:
            inset 0 0 0 2px rgba(50,18,8,.65),
            inset 0 -70px 90px rgba(180,38,0,.55),
            inset 0 0 55px rgba(0,0,0,.34);
        }
      }
      #nyx-parchment .flameband{
        position:absolute;
        left:-8%;
        width:116%;
        height:34%;
        bottom:-2%;
        background:
          radial-gradient(ellipse at 6% 100%, rgba(255,250,215,1) 0 12%, rgba(255,186,72,.98) 18%, transparent 42%),
          radial-gradient(ellipse at 20% 100%, rgba(255,248,208,1) 0 12%, rgba(255,169,51,.98) 20%, transparent 46%),
          radial-gradient(ellipse at 36% 100%, rgba(255,238,190,1) 0 10%, rgba(255,137,24,.98) 18%, transparent 44%),
          radial-gradient(ellipse at 52% 100%, rgba(255,231,182,1) 0 10%, rgba(255,109,4,.98) 18%, transparent 46%),
          radial-gradient(ellipse at 68% 100%, rgba(255,242,200,1) 0 12%, rgba(255,154,36,.98) 19%, transparent 46%),
          radial-gradient(ellipse at 84% 100%, rgba(255,250,215,1) 0 12%, rgba(255,183,66,.98) 18%, transparent 44%),
          radial-gradient(ellipse at 98% 100%, rgba(255,237,190,1) 0 10%, rgba(255,123,16,.96) 18%, transparent 42%),
          linear-gradient(180deg, rgba(255,180,60,0), rgba(255,118,0,.72) 42%, rgba(117,18,0,.62) 100%);
        filter:blur(.4px) saturate(1.8);
        opacity:0;
        pointer-events:none;
        z-index:4;
        box-shadow: 0 -18px 36px rgba(255,128,0,.42);
        transform-origin: center bottom;
      }
      #nyx-parchment.burn .flameband{ opacity:1; animation:flameUp 2.2s ease-in forwards; }
      @keyframes flameUp{
        0%{ transform:translateY(38%) scaleY(.78); opacity:0; }
        18%{ opacity:1; }
        55%{ transform:translateY(2%) scaleY(1.02); opacity:1; }
        100%{ transform:translateY(-72%) scaleY(1.26); opacity:.95; }
      }
      .charline{
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        height:24%;
        background:
          linear-gradient(180deg, rgba(255,154,38,0), rgba(255,116,0,.42), rgba(74,20,4,.92)),
          radial-gradient(circle at 50% 100%, rgba(255,220,135,.45), transparent 52%);
        opacity:0;
        pointer-events:none;
        z-index:3;
      }
      #nyx-parchment.burn .charline{
        animation:charGlow 1.4s ease-in forwards;
      }
      @keyframes charGlow{
        0%{ opacity:0; transform:translateY(20px); }
        35%{ opacity:.85; }
        100%{ opacity:1; transform:translateY(0); }
      }
      .ashcloud{
        position:absolute;
        inset:auto -6% 8% -6%;
        height:26%;
        background:
          radial-gradient(circle at 18% 80%, rgba(70,70,70,.26), transparent 34%),
          radial-gradient(circle at 48% 75%, rgba(55,55,55,.22), transparent 32%),
          radial-gradient(circle at 76% 78%, rgba(65,65,65,.24), transparent 34%);
        filter:blur(14px);
        opacity:0;
        pointer-events:none;
        z-index:5;
      }
      #nyx-parchment.burn .ashcloud{
        animation:ashRise 1.8s ease-out forwards;
      }
      @keyframes ashRise{
        0%{ opacity:0; transform:translateY(18px) scale(.95); }
        30%{ opacity:.4; }
        100%{ opacity:0; transform:translateY(-86px) scale(1.1); }
      }
      .ember{
        position:absolute;
        bottom:12%;
        left:50%;
        width:10px;
        height:10px;
        border-radius:999px;
        background:rgba(255,196,92,1);
        box-shadow:0 0 20px rgba(255,120,0,.78);
        opacity:0;
        pointer-events:none;
        transform:translateX(-50%);
        z-index:6;
      }
      @keyframes emberRise{
        0%{ transform:translateX(-50%) translateY(0) scale(1); opacity:1; filter:blur(0); }
        100%{ transform:translateX(-50%) translateY(-180px) scale(.18); opacity:0; filter:blur(1px); }
      }
    `;
    document.head.appendChild(style);

    return { eye, overlay, parchment: overlay.querySelector('#nyx-parchment'), content: overlay.querySelector('#nyx-content') };
  }

  function buildMessage(lines, solution) {
    const wrapper = document.createElement('div');
    lines.forEach((line) => {
      const item = document.createElement('div');
      item.className = 'nyx-line';
      appendAnimatedWords(item, line);
      wrapper.appendChild(item);
    });

    const solutionLine = document.createElement('div');
    solutionLine.className = 'nyx-line nyx-solution';
    const strong = document.createElement('strong');
    appendAnimatedWords(strong, solution);
    solutionLine.appendChild(strong);
    wrapper.appendChild(solutionLine);
    return wrapper;
  }

  function appendAnimatedWords(container, text) {
    const parts = String(text).split(/(\s+)/);
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        container.appendChild(document.createTextNode(part));
        return;
      }
      const word = document.createElement('span');
      word.className = 'nyx-word';
      word.textContent = part;
      container.appendChild(word);
    });
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

      function vanishWordsThenBurn(parchment, content, overlay) {
    const words = shuffle(Array.from(content.querySelectorAll('.nyx-word')));
    const base = 28;
    words.forEach((word, index) => {
      const jitter = Math.floor(Math.random() * 40);
      setTimeout(() => word.classList.add('vanish'), index * base + jitter);
    });

    const vanishTotal = words.length * base + 500;
      setTimeout(() => {
      if (!parchment.querySelector('.flameband')) {
        const flame = document.createElement('div');
        flame.className = 'flameband';
        parchment.appendChild(flame);
        const charline = document.createElement('div');
        charline.className = 'charline';
        parchment.appendChild(charline);
        const ash = document.createElement('div');
        ash.className = 'ashcloud';
        parchment.appendChild(ash);
        const ember = document.createElement('div');
        ember.className = 'ember';
        parchment.appendChild(ember);
      }
      parchment.classList.add('burn');
      }, Math.max(700, vanishTotal - 500));

      setTimeout(() => {
      overlay.classList.remove('show');
      overlay.style.display = 'none';
    }, vanishTotal + 2600);
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

    if (status.usedToday) return;
    if (!status.windowOpen) return;
    if (!status.showEye) return;

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
          ui.eye.remove();
          return;
        }

        payload = await response.json();
      } catch {
        ui.eye.disabled = false;
        ui.eye.style.pointerEvents = '';
        ui.eye.style.opacity = '';
        return;
      }

      ui.eye.style.display = 'none';
      document.body.classList.remove('nyx-night');
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
      setTimeout(() => vanishWordsThenBurn(ui.parchment, ui.content, ui.overlay), 7000);
    });
  }

  initNyx();
})();
