(function () {
  const QUESTION_SETS = {
    one: [
      {
        prompt: "Sous quel nom Ulysse se présente-t-il au Cyclope Polyphème ?",
        choices: [
          { label: "Personne", value: "personne" },
          { label: "Ulysse", value: "ulysse" },
          { label: "Télémaque", value: "telemaque" }
        ],
        answer: "personne"
      },
      {
        prompt: "Combien de compagnons d'Ulysse entrent avec lui dans la caverne du Cyclope ?",
        choices: [
          { label: "Douze", value: "douze" },
          { label: "Huit", value: "huit" },
          { label: "Vingt", value: "vingt" }
        ],
        answer: "douze"
      },
      {
        prompt: "Quel héros grec affronte le Cyclope Polyphème dans l'Odyssée ?",
        choices: [
          { label: "Ulysse", value: "ulysse" },
          { label: "Achille", value: "achille" },
          { label: "Hector", value: "hector" }
        ],
        answer: "ulysse"
      }
    ],
    two: [
      {
        prompt: "Que donne Ulysse au Cyclope avant de l'aveugler ?",
        choices: [
          { label: "Du vin", value: "vin" },
          { label: "De l'eau", value: "eau" },
          { label: "Du miel", value: "miel" }
        ],
        answer: "vin"
      },
      {
        prompt: "Avec quoi Ulysse perce-t-il l'oeil du Cyclope ?",
        choices: [
          { label: "Un pieu d'olivier", value: "pieu" },
          { label: "Une epee de bronze", value: "epee" },
          { label: "Une lance d'argent", value: "lance" }
        ],
        answer: "pieu"
      },
      {
        prompt: "Qui aide Ulysse a s'echapper de la caverne du Cyclope ?",
        choices: [
          { label: "Les beliers", value: "beliers" },
          { label: "Athena", value: "athena" },
          { label: "Hermes", value: "hermes" }
        ],
        answer: "beliers"
      }
    ]
  };

  const CAPTCHA_CATEGORIES = [
    {
      key: "armes",
      label: "armes",
      items: [
        { id: "arme_01", src: "/captcha-assets/arme_01.png", label: "Arme" },
        { id: "arme_02", src: "/captcha-assets/arme_02.png", label: "Arme" },
        { id: "arme_03", src: "/captcha-assets/arme_03.png", label: "Arme" },
        { id: "arme_04", src: "/captcha-assets/arme_04.png", label: "Arme" },
        { id: "arme_05", src: "/captcha-assets/arme_05.png", label: "Arme" },
        { id: "arme_06", src: "/captcha-assets/arme_06.png", label: "Arme" },
        { id: "arme_07", src: "/captcha-assets/arme_07.png", label: "Arme" },
        { id: "arme_08", src: "/captcha-assets/arme_08.png", label: "Arme" },
        { id: "arme_09", src: "/captcha-assets/arme_09.png", label: "Arme" }
      ]
    },
    {
      key: "boucliers",
      label: "boucliers",
      items: [
        { id: "bouclier_01", src: "/captcha-assets/bouclier_01_owl.png", label: "Bouclier" },
        { id: "bouclier_02", src: "/captcha-assets/bouclier_02_trident.png", label: "Bouclier" },
        { id: "bouclier_03", src: "/captcha-assets/bouclier_03_boar.png", label: "Bouclier" },
        { id: "bouclier_04", src: "/captcha-assets/bouclier_04_torch.png", label: "Bouclier" },
        { id: "bouclier_05", src: "/captcha-assets/bouclier_05_pegasus.png", label: "Bouclier" },
        { id: "bouclier_06", src: "/captcha-assets/bouclier_06_bull.png", label: "Bouclier" },
        { id: "bouclier_07", src: "/captcha-assets/bouclier_07_starburst.png", label: "Bouclier" },
        { id: "bouclier_08", src: "/captcha-assets/bouclier_08_gorgon.png", label: "Bouclier" },
        { id: "bouclier_09", src: "/captcha-assets/bouclier_09_lambda.png", label: "Bouclier" }
      ]
    },
    {
      key: "casques",
      label: "casques",
      items: [
        { id: "casque_01", src: "/captcha-assets/casque_01_hibou.png", label: "Casque" },
        { id: "casque_02", src: "/captcha-assets/casque_02_meandre.png", label: "Casque" },
        { id: "casque_03", src: "/captcha-assets/casque_03_laurier.png", label: "Casque" },
        { id: "casque_04", src: "/captcha-assets/casque_04_soleil.png", label: "Casque" },
        { id: "casque_05", src: "/captcha-assets/casque_05_palmettes.png", label: "Casque" },
        { id: "casque_06", src: "/captcha-assets/casque_06_couronne.png", label: "Casque" },
        { id: "casque_07", src: "/captcha-assets/casque_07_eclair.png", label: "Casque" },
        { id: "casque_08", src: "/captcha-assets/casque_08_volutes.png", label: "Casque" },
        { id: "casque_09", src: "/captcha-assets/casque_09_laurier.png", label: "Casque" }
      ]
    },
    {
      key: "amphores",
      label: "amphores",
      items: [
        { id: "amphore_01", src: "/captcha-assets/amphore_01_propre.png", label: "Amphore" },
        { id: "amphore_02", src: "/captcha-assets/amphore_02_propre.png", label: "Amphore" },
        { id: "amphore_03", src: "/captcha-assets/amphore_03_propre.png", label: "Amphore" },
        { id: "amphore_04", src: "/captcha-assets/amphore_04_propre.png", label: "Amphore" },
        { id: "amphore_05", src: "/captcha-assets/amphore_05_propre.png", label: "Amphore" },
        { id: "amphore_06", src: "/captcha-assets/amphore_06_propre.png", label: "Amphore" },
        { id: "amphore_07", src: "/captcha-assets/amphore_07_propre.png", label: "Amphore" },
        { id: "amphore_08", src: "/captcha-assets/amphore_08_propre.png", label: "Amphore" },
        { id: "amphore_09", src: "/captcha-assets/amphore_09_propre.png", label: "Amphore" }
      ]
    }
  ];

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickRandom(items, count) {
    return shuffle(items).slice(0, count);
  }

  function toRoman(value) {
    const numerals = [
      ["X", 10],
      ["IX", 9],
      ["V", 5],
      ["IV", 4],
      ["I", 1]
    ];
    let remaining = value;
    let result = "";
    numerals.forEach(([symbol, amount]) => {
      while (remaining >= amount) {
        result += symbol;
        remaining -= amount;
      }
    });
    return result;
  }

  function buildMathQuestion() {
    const values = [
      6 + Math.floor(Math.random() * 10),
      7 + Math.floor(Math.random() * 9),
      5 + Math.floor(Math.random() * 8)
    ];
    const answer = values.reduce((sum, value) => sum + value, 0);
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 6));
      const candidate = answer + offset;
      if (candidate > 0 && candidate !== answer) {
        wrongAnswers.add(candidate);
      }
    }

    return {
      prompt: `Quelle est la valeur de ${values.map((value) => toRoman(value)).join(" + ")} ?`,
      choices: shuffle([
        { label: toRoman(answer), value: String(answer) },
        ...Array.from(wrongAnswers).map((value) => ({
          label: toRoman(value),
          value: String(value)
        }))
      ]),
      answer: String(answer)
    };
  }

  function injectCaptchaStyles() {
    if (document.getElementById("captcha-style")) return;

    const style = document.createElement("style");
    style.id = "captcha-style";
    style.textContent = `
      #captcha-overlay{
        position:fixed;
        inset:0;
        display:none;
        align-items:center;
        justify-content:center;
        background:rgba(8, 10, 18, .78);
        backdrop-filter: blur(4px);
        z-index:10001;
        padding:18px;
      }
      #captcha-overlay.show{
        display:flex;
      }
      .captcha-card{
        width:min(94vw, 760px);
        max-height:min(92vh, 860px);
        overflow:auto;
        border-radius:24px;
        padding:30px 24px 24px;
        background:
          radial-gradient(circle at top, rgba(255,246,227,.96), rgba(241,225,191,.97)),
          linear-gradient(180deg, rgba(251,244,229,1), rgba(230,213,182,1));
        border:1px solid rgba(112,69,25,.36);
        box-shadow:0 28px 60px rgba(0,0,0,.32);
        color:#4a260e;
        text-align:center;
        font-family:'GaramondAntique', serif;
      }
      .captcha-kicker{
        margin:0 0 10px;
        font-size:1.05rem;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#8B4513;
      }
      .captcha-title{
        margin:0 0 10px;
        font-size:2rem;
      }
      .captcha-text{
        margin:0 0 18px;
        font-size:1.2rem;
        line-height:1.45;
      }
      .captcha-step{
        display:none;
      }
      .captcha-step.active{
        display:block;
      }
      .captcha-actions{
        display:flex;
        gap:12px;
        justify-content:center;
        flex-wrap:wrap;
        margin-top:18px;
      }
      .captcha-choice,
      .captcha-confirm,
      .captcha-cancel{
        border:none;
        border-radius:14px;
        padding:14px 18px;
        cursor:pointer;
        font-family:'GaramondAntique', serif;
        font-size:1.08rem;
        transition:transform .16s ease, box-shadow .16s ease, background .16s ease;
      }
      .captcha-choice,
      .captcha-confirm{
        background:#8B4513;
        color:#fff8eb;
        box-shadow:0 10px 18px rgba(82,40,6,.24);
      }
      .captcha-cancel{
        background:rgba(255,255,255,.62);
        color:#5D2F0A;
        border:1px solid rgba(93,47,10,.2);
      }
      .captcha-choice:hover,
      .captcha-confirm:hover,
      .captcha-cancel:hover,
      .captcha-object:hover{
        transform:translateY(-2px);
      }
      .captcha-grid{
        display:grid;
        grid-template-columns:repeat(4, minmax(0, 1fr));
        gap:8px;
        margin-top:14px;
      }
      .captcha-object{
        border:1px solid transparent;
        border-radius:14px;
        background:transparent;
        color:#4a260e;
        cursor:pointer;
        padding:8px 6px;
        min-height:112px;
        transition:transform .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease, outline-color .16s ease;
        box-shadow:none;
        outline:1px solid transparent;
      }
      .captcha-object.selected{
        background:rgba(139,69,19,.08);
        border-color:#8B4513;
        box-shadow:0 8px 16px rgba(139,69,19,.12);
        outline-color:rgba(139,69,19,.18);
      }
      .captcha-figure{
        display:flex;
        align-items:center;
        justify-content:center;
        height:92px;
        margin-bottom:0;
      }
      .captcha-figure img{
        max-width:100%;
        max-height:92px;
        object-fit:contain;
        filter:drop-shadow(0 10px 10px rgba(0,0,0,.16));
      }
      .captcha-feedback{
        min-height:24px;
        margin-top:14px;
        font-family:system-ui, -apple-system, Segoe UI, sans-serif;
        font-size:.95rem;
        color:#912b11;
      }
      .captcha-failflash{
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        pointer-events:none;
        opacity:0;
        z-index:10002;
        transition:opacity .12s ease;
      }
      .captcha-failflash span{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:120px;
        height:120px;
        color:#d11212;
        text-shadow:0 10px 24px rgba(122, 0, 0, .38);
        font-size:4.5rem;
        transform:scale(.82);
      }
      .captcha-failflash.show{
        opacity:1;
      }
      .captcha-failflash.show span{
        animation:captchaFailPulse .95s ease;
      }
      .captcha-successflash{
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        pointer-events:none;
        opacity:0;
        z-index:10002;
        transition:opacity .12s ease;
      }
      .captcha-successflash span{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:120px;
        height:120px;
        border-radius:999px;
        background:rgba(27, 142, 67, .9);
        box-shadow:0 18px 40px rgba(9, 82, 36, .34);
        color:#f4fff7;
        font-size:4rem;
        transform:scale(.82);
      }
      .captcha-successflash.show{
        opacity:1;
      }
      .captcha-successflash.show span{
        animation:captchaSuccessPulse .72s ease;
      }
      @keyframes captchaFailPulse{
        0%{ transform:scale(.82); }
        22%{ transform:scale(1.02); }
        60%{ transform:scale(.96); }
        100%{ transform:scale(.9); }
      }
      @keyframes captchaSuccessPulse{
        0%{ transform:scale(.82); }
        28%{ transform:scale(1.08); }
        62%{ transform:scale(.98); }
        100%{ transform:scale(1); }
      }
      @media (max-width: 767px){
        #captcha-overlay{
          padding:8px;
        }
        .captcha-card{
          width:min(98vw, 430px);
          max-height:min(96vh, 820px);
          padding:16px 10px 12px;
          border-radius:18px;
        }
        .captcha-kicker{
          margin-bottom:6px;
          font-size:.82rem;
        }
        .captcha-title{
          margin-bottom:6px;
          font-size:1.22rem;
        }
        .captcha-text{
          margin-bottom:10px;
          font-size:.86rem;
          line-height:1.28;
        }
        .captcha-actions{
          gap:8px;
          margin-top:10px;
        }
        .captcha-choice,
        .captcha-confirm,
        .captcha-cancel{
          padding:10px 12px;
          font-size:.9rem;
        }
        .captcha-grid{
          grid-template-columns:repeat(4, minmax(0, 1fr));
          gap:4px;
          margin-top:8px;
        }
        .captcha-object{
          padding:4px 2px;
          min-height:72px;
          border-radius:10px;
        }
        .captcha-figure{
          height:62px;
        }
        .captcha-figure img{
          max-height:62px;
        }
        .captcha-feedback{
          min-height:18px;
          margin-top:8px;
          font-size:.8rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectCaptchaMarkup() {
    if (document.getElementById("captcha-overlay")) {
      return document.getElementById("captcha-overlay");
    }

    const overlay = document.createElement("div");
    overlay.id = "captcha-overlay";
    overlay.innerHTML = `
      <div class="captcha-card" role="dialog" aria-modal="true" aria-label="Vérification d'accès">
        <p class="captcha-kicker">Prouvez que vous etes un mortel</p>
        <div class="captcha-step active" data-step="question-1">
          <h2 class="captcha-title">Question I</h2>
          <p class="captcha-text" data-question-text></p>
          <div class="captcha-actions" data-question-choices></div>
          <div class="captcha-feedback" data-feedback></div>
        </div>
        <div class="captcha-step" data-step="question-2">
          <h2 class="captcha-title">Question II</h2>
          <p class="captcha-text" data-question-text></p>
          <div class="captcha-actions" data-question-choices></div>
          <div class="captcha-feedback" data-feedback></div>
        </div>
        <div class="captcha-step" data-step="question-3">
          <h2 class="captcha-title">Avant-dernière épreuve</h2>
          <p class="captcha-text" data-question-text></p>
          <div class="captcha-actions" data-question-choices></div>
          <div class="captcha-feedback" data-feedback></div>
        </div>
        <div class="captcha-step" data-step="objects">
          <h2 class="captcha-title">Epreuve 4</h2>
          <p class="captcha-text" data-object-instruction></p>
          <div class="captcha-grid" data-captcha-grid></div>
          <div class="captcha-actions">
            <button class="captcha-confirm" type="button">Valider</button>
            <button class="captcha-cancel" type="button">Annuler</button>
          </div>
          <div class="captcha-feedback" data-feedback></div>
        </div>
        <div class="captcha-successflash" aria-hidden="true"><span>✓</span></div>
        <div class="captcha-failflash" aria-hidden="true"><span>✖</span></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderQuestion(stepNode, question, onSuccess, onFailure) {
    const text = stepNode.querySelector("[data-question-text]");
    const choices = stepNode.querySelector("[data-question-choices]");
    const feedback = stepNode.querySelector("[data-feedback]");
    text.textContent = question.prompt;
    choices.innerHTML = "";
    feedback.textContent = "";

    shuffle(question.choices).forEach((choice) => {
      const button = document.createElement("button");
      button.className = "captcha-choice";
      button.type = "button";
      button.textContent = choice.label;
      button.onclick = () => {
        if (choice.value === question.answer) {
          feedback.textContent = "";
          onSuccess();
          return;
        }
        feedback.textContent = "";
        onFailure();
      };
      choices.appendChild(button);
    });
  }

  function buildRound() {
    const targetCategory = CAPTCHA_CATEGORIES[Math.floor(Math.random() * CAPTCHA_CATEGORIES.length)];
    const distractors = CAPTCHA_CATEGORIES.filter((category) => category.key !== targetCategory.key);
    const targetItems = pickRandom(targetCategory.items, 4);
    const otherItems = distractors.flatMap((category) => pickRandom(category.items, 4));

    return {
      targetCategory,
      items: shuffle([...targetItems, ...otherItems]),
      validIds: new Set(targetItems.map((item) => item.id))
    };
  }

  function openLettersCaptcha(link) {
    injectCaptchaStyles();
    const overlay = injectCaptchaMarkup();
    const stepOne = overlay.querySelector('[data-step="question-1"]');
    const stepTwo = overlay.querySelector('[data-step="question-2"]');
    const stepThree = overlay.querySelector('[data-step="question-3"]');
    const objectStep = overlay.querySelector('[data-step="objects"]');
    const grid = overlay.querySelector("[data-captcha-grid]");
    const confirmButton = overlay.querySelector(".captcha-confirm");
    const cancelButton = overlay.querySelector(".captcha-cancel");
    const objectInstruction = overlay.querySelector("[data-object-instruction]");
    const objectFeedback = objectStep.querySelector("[data-feedback]");
    const successFlash = overlay.querySelector(".captcha-successflash");
    const failFlash = overlay.querySelector(".captcha-failflash");
    const selectedObjects = new Set();
    let round = buildRound();
    let questionOne = pickRandom(QUESTION_SETS.one, 1)[0];
    let questionTwo = pickRandom(QUESTION_SETS.two, 1)[0];
    let mathQuestion = buildMathQuestion();

    function setStep(name) {
      [stepOne, stepTwo, stepThree, objectStep].forEach((step) => {
        step.classList.toggle("active", step.dataset.step === name);
      });
    }

    function closeCaptcha() {
      overlay.classList.remove("show");
      successFlash.classList.remove("show");
      failFlash.classList.remove("show");
      selectedObjects.clear();
      objectFeedback.textContent = "";
      setStep("question-1");
    }

    function flashSuccess(nextStep) {
      successFlash.classList.remove("show");
      void successFlash.offsetWidth;
      successFlash.classList.add("show");
      setTimeout(() => {
        successFlash.classList.remove("show");
        nextStep();
      }, 650);
    }

    function failAndClose() {
      selectedObjects.clear();
      objectFeedback.textContent = "";
      successFlash.classList.remove("show");
      failFlash.classList.remove("show");
      void failFlash.offsetWidth;
      failFlash.classList.add("show");
      setTimeout(() => {
        closeCaptcha();
      }, 1000);
    }

    function renderObjectGrid() {
      selectedObjects.clear();
      grid.innerHTML = "";
      const objectInstructions = {
        armes: "Cliquez sur toutes les armes",
        amphores: "Cliquez sur toutes les amphores",
        boucliers: "Cliquez sur tous les boucliers",
        casques: "Cliquez sur tous les casques"
      };
      objectInstruction.textContent =
        objectInstructions[round.targetCategory.key] || "Cliquez sur tous les objets demandés";
      objectFeedback.textContent = "";

      round.items.forEach((item) => {
        const button = document.createElement("button");
        button.className = "captcha-object";
        button.type = "button";
        button.dataset.object = item.id;
        button.setAttribute("aria-label", item.label);
        button.innerHTML = `
          <span class="captcha-figure"><img src="${item.src}" alt="${item.label}"></span>
        `;
        button.onclick = () => {
          if (selectedObjects.has(item.id)) {
            selectedObjects.delete(item.id);
            button.classList.remove("selected");
            return;
          }
          if (selectedObjects.size >= round.validIds.size) {
            objectFeedback.textContent = `Choisis exactement ${round.validIds.size} images.`;
            return;
          }
          selectedObjects.add(item.id);
          button.classList.add("selected");
          objectFeedback.textContent = "";
        };
        grid.appendChild(button);
      });
    }

    overlay.classList.add("show");
    round = buildRound();
    questionOne = pickRandom(QUESTION_SETS.one, 1)[0];
    questionTwo = pickRandom(QUESTION_SETS.two, 1)[0];
    mathQuestion = buildMathQuestion();
    renderQuestion(stepOne, questionOne, () => {
      flashSuccess(() => {
        setStep("question-2");
      });
    }, failAndClose);
    renderQuestion(stepTwo, questionTwo, () => {
      flashSuccess(() => {
        setStep("question-3");
      });
    }, failAndClose);
    renderQuestion(stepThree, mathQuestion, () => {
      flashSuccess(() => {
        round = buildRound();
        renderObjectGrid();
        setStep("objects");
      });
    }, failAndClose);
    setStep("question-1");

    confirmButton.onclick = () => {
      const isValid =
        selectedObjects.size === round.validIds.size &&
        Array.from(round.validIds).every((id) => selectedObjects.has(id));

      if (!isValid) {
        objectFeedback.textContent = "Les immortels ne s'y trompent pas. Vérifie tes choix.";
        return;
      }

      closeCaptcha();
      window.open(link.href, "_blank", "noopener");
    };

    cancelButton.onclick = closeCaptcha;
    overlay.onclick = (event) => {
      if (event.target === overlay) {
        closeCaptcha();
      }
    };
  }

  function bindProtectedLinks() {
    const links = [
      document.getElementById("letters-link"),
      document.getElementById("trailer-link")
    ].filter(Boolean);

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openLettersCaptcha(link);
      });
    });
  }

  async function loadRuntime() {
    let status;
    try {
      const response = await fetch("/api/nyx-status", { credentials: "same-origin" });
      if (!response.ok) return;
      status = await response.json();
    } catch {
      return;
    }

    if (!status || !status.showEye) return;

    const script = document.createElement("script");
    script.src = "/api/runtime";
    script.defer = true;
    document.body.appendChild(script);
  }

  bindProtectedLinks();
  loadRuntime();
})();
