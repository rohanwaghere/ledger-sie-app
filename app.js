// ============ Ledger — SIE Exam Prep — app.js ============

const STORAGE_KEY = "ledger_sie_progress_v1";
const SETTINGS_KEY = "ledger_sie_settings_v1";
const MASTER_THRESHOLD = 3; // correct answers in a row needed to "retire" a card from heavy rotation

// ---------- Persistence ----------
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { reminderTime: "19:00", remindersOn: false, lastNotified: null, streak: 0, lastStudyDate: null };
  } catch (e) { return { reminderTime: "19:00", remindersOn: false, lastNotified: null, streak: 0, lastStudyDate: null }; }
}
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

let progress = loadProgress();   // { [questionId]: { streak, seen, lastResult } }
let settings = loadSettings();

function getStat(qid) {
  return progress[qid] || { streak: 0, seen: 0, correctTotal: 0 };
}
function recordAnswer(qid, wasCorrect) {
  const s = getStat(qid);
  s.seen += 1;
  if (wasCorrect) { s.streak += 1; s.correctTotal += 1; }
  else { s.streak = 0; }
  progress[qid] = s;
  saveProgress(progress);
  bumpStreakForToday();
}
function bumpStreakForToday() {
  const today = new Date().toDateString();
  if (settings.lastStudyDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  settings.streak = settings.lastStudyDate === yesterday ? settings.streak + 1 : 1;
  settings.lastStudyDate = today;
  saveSettings(settings);
}

function chapterStats(chapter) {
  let mastered = 0, seenAny = 0;
  chapter.questions.forEach(qq => {
    const s = getStat(qq.id);
    if (s.streak >= MASTER_THRESHOLD) mastered++;
    if (s.seen > 0) seenAny++;
  });
  return { mastered, total: chapter.questions.length, seenAny };
}
function overallStats() {
  let total = 0, mastered = 0, seen = 0, attempts = 0, correct = 0;
  CHAPTERS.forEach(ch => ch.questions.forEach(qq => {
    total++;
    const s = getStat(qq.id);
    if (s.streak >= MASTER_THRESHOLD) mastered++;
    if (s.seen > 0) seen++;
    attempts += s.seen; correct += s.correctTotal;
  }));
  return { total, mastered, seen, accuracy: attempts ? Math.round((correct/attempts)*100) : 0 };
}

// ---------- Weighted selection (spaced-repetition-lite) ----------
// Cards already answered correctly several times in a row are shown far less often.
function weightFor(qid) {
  const s = getStat(qid);
  if (s.streak >= MASTER_THRESHOLD) return 0.12;       // rarely shown — mastered
  if (s.streak === 2) return 0.4;
  if (s.streak === 1) return 0.7;
  return 1.0;                                           // never answered correctly yet / wrong last time
}
function weightedPick(pool, excludeId) {
  const candidates = pool.filter(q => q.id !== excludeId);
  const list = candidates.length ? candidates : pool;
  const weights = list.map(q => weightFor(q.id));
  const sum = weights.reduce((a,b)=>a+b,0);
  let r = Math.random() * sum;
  for (let i=0;i<list.length;i++){ r -= weights[i]; if (r<=0) return list[i]; }
  return list[list.length-1];
}
function shuffledByWeight(pool, count) {
  // build a quiz set, biased toward weaker cards, without repeats
  const remaining = [...pool];
  const out = [];
  const n = Math.min(count, remaining.length);
  for (let i=0;i<n;i++){
    const idx = remaining.length;
    const weights = remaining.map(q => weightFor(q.id) + 0.05);
    const sum = weights.reduce((a,b)=>a+b,0);
    let r = Math.random()*sum, pick=0;
    for (let j=0;j<remaining.length;j++){ r-=weights[j]; if(r<=0){pick=j;break;} }
    out.push(remaining.splice(pick,1)[0]);
  }
  return out;
}

// ---------- Router ----------
let route = { name: "home" };
function nav(r) { route = r; render(); window.scrollTo(0,0); }

const app = document.getElementById("app");

function render() {
  app.innerHTML = "";
  app.appendChild(Topbar());
  const main = document.createElement("main");
  main.appendChild(currentView());
  app.appendChild(main);
  app.appendChild(Tabbar());
}

// ---------- Shared chrome ----------
function Topbar() {
  const el = document.createElement("header");
  el.className = "topbar";
  el.innerHTML = `
    <div class="brand">
      <span class="mark">Ledger</span>
      <span class="sub">SIE Prep</span>
    </div>
    <div class="streak">🔥 ${settings.streak || 0}</div>
  `;
  return el;
}

function Tabbar() {
  const tabs = [
    { id: "home", icon: "📚", label: "Chapters" },
    { id: "test", icon: "📝", label: "Test" },
    { id: "concepts", icon: "💡", label: "Concepts" },
    { id: "progress", icon: "📈", label: "Progress" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  const nav_ = document.createElement("nav");
  nav_.className = "tabbar";
  const inner = document.createElement("div");
  inner.className = "inner";
  tabs.forEach(t => {
    const b = document.createElement("button");
    const activeName = route.name === "home" || route.name === "flashcards" ? "home"
      : (route.name === "test" || route.name === "quiz" || route.name === "custom") ? "test"
      : (route.name === "concepts" || route.name === "conceptDetail") ? "concepts"
      : route.name;
    if (activeName === t.id) b.classList.add("active");
    b.innerHTML = `<span class="icon">${t.icon}</span><span>${t.label}</span>`;
    b.onclick = () => nav({ name: t.id });
    inner.appendChild(b);
  });
  nav_.appendChild(inner);
  return nav_;
}

function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html!==undefined) e.innerHTML = html; return e; }

// ---------- Views ----------
function currentView() {
  switch (route.name) {
    case "home": return ChapterListView();
    case "flashcards": return FlashcardView(route.chapterId);
    case "test": return TestHubView();
    case "quiz": return QuizView(route.chapterIds, route.count);
    case "concepts": return ConceptsHubView();
    case "conceptDetail": return ConceptsDetailView(route.chapterId);
    case "progress": return ProgressView();
    case "settings": return SettingsView();
    default: return ChapterListView();
  }
}

// ----- Chapter list / home -----
function ChapterListView() {
  const wrap = el("div");
  wrap.appendChild(el("h1","page-title","Study by chapter"));
  wrap.appendChild(el("p","page-sub","Flip through flashcards organized to match the FINRA SIE outline. Cards you've mastered show up less often, so you spend time where it counts."));
  CHAPTERS.forEach((ch, i) => {
    const st = chapterStats(ch);
    const pct = st.total ? Math.round((st.mastered/st.total)*100) : 0;
    const card = el("div","chapter-card");
    card.innerHTML = `
      <div class="num">${String(i+1).padStart(2,"0")}</div>
      <div class="body">
        <p class="ttl">${ch.title}</p>
        <p class="blurb">${ch.blurb}</p>
        <div class="barwrap"><div class="barfill" style="width:${pct}%"></div></div>
        <span class="pct">${st.mastered}/${st.total} mastered</span>
      </div>
    `;
    card.onclick = () => nav({ name: "flashcards", chapterId: ch.id });
    wrap.appendChild(card);
  });
  return wrap;
}

// ----- Flashcards -----
function FlashcardView(chapterId) {
  const chapter = CHAPTERS.find(c => c.id === chapterId) || CHAPTERS[0];
  const wrap = el("div","card-stage");

  const backBtn = el("button","btn btn-ghost btn-sm","← All chapters");
  backBtn.style.marginBottom = "14px";
  backBtn.onclick = () => nav({ name:"home" });
  wrap.appendChild(backBtn);

  wrap.appendChild(el("h1","page-title", chapter.title));

  const strip = el("div","progress-strip");
  chapter.questions.forEach(qq => {
    const seg = el("div","seg" + (getStat(qq.id).streak >= MASTER_THRESHOLD ? " done":""));
    strip.appendChild(seg);
  });
  wrap.appendChild(strip);

  let current = weightedPick(chapter.questions, null);
  let flipped = false;
  let answered = false;
  let selectedIdx = null;
  let lastWasCorrect = null;

  const cardEl = el("div","flashcard");
  function renderCard() {
    cardEl.className = "flashcard" + (flipped ? " flipped" : "");
    const st = getStat(current.id);
    const tagText = st.streak >= MASTER_THRESHOLD ? "MASTERED" : (st.seen ? "REVIEW" : "NEW");

    let answerHtml = "";
    if (flipped) {
      const choicesHtml = current.choices.map((c,i) => {
        let cls = "choice choice-btn";
        if (answered) {
          if (i === current.correct) cls += " correct";
          else if (i === selectedIdx) cls += " wrong";
        }
        return `<button type="button" class="${cls}" data-idx="${i}" ${answered ? "disabled" : ""}>${c}</button>`;
      }).join("");
      answerHtml = `
        <div class="answer-area" style="display:block;">
          ${choicesHtml}
          ${answered ? `<p class="result-line ${lastWasCorrect ? 'is-correct':'is-wrong'}">${lastWasCorrect ? "✓ Correct" : "✗ Not quite"}</p><p class="explain">${current.explain}</p>` : ""}
        </div>
      `;
    }

    cardEl.innerHTML = `
      <span class="tag">${tagText} · ${chapter.title}</span>
      <p class="qtext">${current.question}</p>
      ${answerHtml}
      <span class="hint">${flipped ? (answered ? "" : "Choose an answer") : "Tap to reveal choices"}</span>
    `;

    if (flipped && !answered) {
      Array.from(cardEl.querySelectorAll(".choice-btn")).forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          selectedIdx = parseInt(btn.dataset.idx, 10);
          answered = true;
          lastWasCorrect = selectedIdx === current.correct;
          recordAnswer(current.id, lastWasCorrect);
          renderCard();
          buildRateRow();
          refreshStrip();
        };
      });
    }
  }
  renderCard();
  cardEl.onclick = () => {
    if (!flipped) { flipped = true; renderCard(); }
  };
  wrap.appendChild(cardEl);

  const rateSlot = el("div");
  wrap.appendChild(rateSlot);

  function buildRateRow() {
    rateSlot.innerHTML = "";
    const row = el("div","rate-row");
    const again = el("button","rate-btn rate-again","Still learning");
    const good = el("button","rate-btn rate-good","Next card");
    again.onclick = () => { recordAnswer(current.id, false); nextCard(); };
    good.onclick = () => { nextCard(); };
    row.appendChild(again); row.appendChild(good);
    rateSlot.appendChild(row);
  }

  function nextCard() {
    current = weightedPick(chapter.questions, current.id);
    flipped = false;
    answered = false;
    selectedIdx = null;
    lastWasCorrect = null;
    renderCard();
    rateSlot.innerHTML = "";
    refreshStrip();
  }
  function refreshStrip() {
    strip.innerHTML = "";
    chapter.questions.forEach(qq => {
      const seg = el("div","seg" + (getStat(qq.id).streak >= MASTER_THRESHOLD ? " done":""));
      strip.appendChild(seg);
    });
  }

  return wrap;
}

// ----- Test hub (per-chapter + custom) -----
function TestHubView() {
  const wrap = el("div");
  wrap.appendChild(el("h1","page-title","Test your knowledge"));
  wrap.appendChild(el("p","page-sub","Quiz yourself chapter-by-chapter, or build a custom mixed test from any combination of chapters."));

  wrap.appendChild(el("div","section-label","Quick chapter test"));
  CHAPTERS.forEach(ch => {
    const card = el("div","chapter-card");
    const st = chapterStats(ch);
    card.innerHTML = `
      <div class="num">${ch.questions.length}</div>
      <div class="body">
        <p class="ttl">${ch.title}</p>
        <p class="blurb">${st.mastered}/${st.total} mastered · tap to start a ${ch.questions.length}-question quiz</p>
      </div>
    `;
    card.onclick = () => nav({ name:"quiz", chapterIds:[ch.id], count: ch.questions.length });
    wrap.appendChild(card);
  });

  wrap.appendChild(el("div","section-label","Custom test"));
  const box = el("div","chapter-card");
  box.style.flexDirection = "column"; box.style.alignItems="stretch"; box.style.cursor="default";
  const checklist = el("div","checklist");
  CHAPTERS.forEach(ch => {
    const label = el("label","");
    label.innerHTML = `<input type="checkbox" value="${ch.id}" checked /> ${ch.title}`;
    checklist.appendChild(label);
  });
  box.appendChild(checklist);

  const countWrap = el("div");
  countWrap.style.marginTop = "12px";
  countWrap.innerHTML = `<label style="font-size:13px;color:#aab4c6;">Number of questions: <span id="countLabel">15</span></label>
    <input type="range" min="5" max="40" step="5" value="15" id="countSlider" />`;
  box.appendChild(countWrap);

  const startBtn = el("button","btn btn-primary btn-block","Start custom test");
  startBtn.style.marginTop = "14px";
  box.appendChild(startBtn);

  wrap.appendChild(box);

  setTimeout(() => {
    const slider = document.getElementById("countSlider");
    const label = document.getElementById("countLabel");
    slider.oninput = () => label.textContent = slider.value;
  }, 0);

  startBtn.onclick = () => {
    const checked = Array.from(checklist.querySelectorAll("input:checked")).map(i => i.value);
    if (!checked.length) { alert("Pick at least one chapter."); return; }
    const slider = document.getElementById("countSlider");
    nav({ name:"quiz", chapterIds: checked, count: parseInt(slider.value,10) });
  };

  return wrap;
}

// ----- Quiz player -----
function QuizView(chapterIds, count) {
  const pool = CHAPTERS.filter(c => chapterIds.includes(c.id)).flatMap(c => c.questions);
  const set = shuffledByWeight(pool, count);

  const wrap = el("div");
  const backBtn = el("button","btn btn-ghost btn-sm","← Exit test");
  backBtn.style.marginBottom = "14px";
  backBtn.onclick = () => { if (confirm("Exit this test? Your progress on answered questions is saved.")) nav({name:"test"}); };
  wrap.appendChild(backBtn);

  let idx = 0, score = 0, locked = false, selected = null;
  const body = el("div");
  wrap.appendChild(body);

  function renderQ() {
    locked = false; selected = null;
    const qq = set[idx];
    body.innerHTML = "";
    const foot1 = el("div","quiz-foot");
    foot1.innerHTML = `<span>Question ${idx+1} of ${set.length}</span><span>Score: ${score}</span>`;
    body.appendChild(foot1);
    body.appendChild(el("p","quiz-q", qq.question));

    qq.choices.forEach((c,i) => {
      const b = el("button","quiz-choice", c);
      b.onclick = () => selectChoice(i);
      body.appendChild(b);
    });

    const nextSlot = el("div");
    nextSlot.style.marginTop = "16px";
    body.appendChild(nextSlot);

    function selectChoice(i) {
      if (locked) return;
      locked = true; selected = i;
      const correct = i === qq.correct;
      if (correct) score++;
      recordAnswer(qq.id, correct);
      Array.from(body.querySelectorAll(".quiz-choice")).forEach((btn, bi) => {
        if (bi === qq.correct) btn.classList.add("correct");
        else if (bi === i) btn.classList.add("wrong");
      });
      const exp = el("p","explain", qq.explain);
      exp.style.color = "#cdd5e3"; exp.style.marginTop="12px"; exp.style.fontSize="13px"; exp.style.lineHeight="1.5";
      body.appendChild(exp);
      const nextBtn = el("button","btn btn-primary btn-block", idx === set.length-1 ? "See results" : "Next question");
      nextBtn.style.marginTop = "14px";
      nextBtn.onclick = () => {
        idx++;
        if (idx >= set.length) renderResults();
        else renderQ();
      };
      nextSlot.appendChild(nextBtn);
    }
  }

  function renderResults() {
    body.innerHTML = "";
    const pct = Math.round((score/set.length)*100);
    body.appendChild(el("h1","page-title","Test complete"));
    const grid = el("div","stat-grid");
    grid.innerHTML = `
      <div class="stat-box"><div class="num">${pct}%</div><div class="lbl">Score</div></div>
      <div class="stat-box"><div class="num">${score}/${set.length}</div><div class="lbl">Correct</div></div>
    `;
    body.appendChild(grid);
    const msg = pct >= 80 ? "Strong work — you're exam ready on this material." :
                pct >= 60 ? "Good progress. Revisit the missed topics with flashcards." :
                "Worth another pass — head back to flashcards for these chapters.";
    body.appendChild(el("p","page-sub", msg));
    const retry = el("button","btn btn-primary btn-block","Take another test");
    retry.onclick = () => nav({ name:"test" });
    body.appendChild(retry);
    const home = el("button","btn btn-ghost btn-block","Back to chapters");
    home.style.marginTop="10px";
    home.onclick = () => nav({ name:"home" });
    body.appendChild(home);
  }

  renderQ();
  return wrap;
}

// ----- Concepts (study notes) -----
function ConceptsHubView() {
  const wrap = el("div");
  wrap.appendChild(el("h1","page-title","Concepts & details"));
  wrap.appendChild(el("p","page-sub","Plain-language explanations of the ideas behind the questions — read these when you want the 'why,' not just the right answer."));
  CHAPTERS.forEach((ch, i) => {
    const list = (CONCEPTS && CONCEPTS[ch.id]) || [];
    const card = el("div","chapter-card");
    card.innerHTML = `
      <div class="num">${String(i+1).padStart(2,"0")}</div>
      <div class="body">
        <p class="ttl">${ch.title}</p>
        <p class="blurb">${list.length} key concepts explained</p>
      </div>
    `;
    card.onclick = () => nav({ name:"conceptDetail", chapterId: ch.id });
    wrap.appendChild(card);
  });
  return wrap;
}

function ConceptsDetailView(chapterId) {
  const chapter = CHAPTERS.find(c => c.id === chapterId) || CHAPTERS[0];
  const list = (CONCEPTS && CONCEPTS[chapter.id]) || [];

  const wrap = el("div");
  const backBtn = el("button","btn btn-ghost btn-sm","← All concepts");
  backBtn.style.marginBottom = "14px";
  backBtn.onclick = () => nav({ name:"concepts" });
  wrap.appendChild(backBtn);

  wrap.appendChild(el("h1","page-title", chapter.title));
  wrap.appendChild(el("p","page-sub", chapter.blurb));

  if (!list.length) {
    wrap.appendChild(el("p","empty","Concepts for this chapter are coming soon."));
    return wrap;
  }

  list.forEach((item, i) => {
    const card = el("div","concept-card");
    const head = el("div","concept-head");
    head.innerHTML = `<span class="term">${item.term}</span><span class="chev">▶</span>`;
    const body = el("div","concept-body", `<p>${item.detail}</p>`);
    head.onclick = () => { card.classList.toggle("open"); };
    card.appendChild(head);
    card.appendChild(body);
    if (i === 0) card.classList.add("open");
    wrap.appendChild(card);
  });

  return wrap;
}


// ----- Progress -----
function ProgressView() {
  const wrap = el("div");
  wrap.appendChild(el("h1","page-title","Your progress"));
  const o = overallStats();
  const grid = el("div","stat-grid");
  grid.innerHTML = `
    <div class="stat-box"><div class="num">${o.mastered}/${o.total}</div><div class="lbl">Mastered</div></div>
    <div class="stat-box"><div class="num">${o.accuracy}%</div><div class="lbl">Overall accuracy</div></div>
    <div class="stat-box"><div class="num">${settings.streak||0}</div><div class="lbl">Day streak</div></div>
    <div class="stat-box"><div class="num">${o.seen}</div><div class="lbl">Cards studied</div></div>
  `;
  wrap.appendChild(grid);

  wrap.appendChild(el("div","section-label","By chapter"));
  CHAPTERS.forEach(ch => {
    const st = chapterStats(ch);
    const pct = st.total ? Math.round((st.mastered/st.total)*100) : 0;
    const row = el("div","chapter-card");
    row.style.cursor="default";
    row.innerHTML = `
      <div class="num">${pct}%</div>
      <div class="body">
        <p class="ttl">${ch.title}</p>
        <div class="barwrap"><div class="barfill" style="width:${pct}%"></div></div>
        <span class="pct">${st.mastered}/${st.total} mastered · ${st.seenAny}/${st.total} attempted</span>
      </div>
    `;
    wrap.appendChild(row);
  });

  if (o.seen === 0) {
    wrap.appendChild(el("p","empty","Study your first chapter to start tracking progress here."));
  }
  return wrap;
}

// ----- Settings / reminders -----
function SettingsView() {
  const wrap = el("div");
  wrap.appendChild(el("h1","page-title","Settings"));
  wrap.appendChild(el("p","page-sub","Set a daily reminder so studying becomes a habit. Reminders fire while the app is open in your browser or installed on your home screen."));

  const box = el("div","chapter-card");
  box.style.flexDirection="column"; box.style.alignItems="stretch"; box.style.cursor="default";
  box.innerHTML = `
    <label style="font-size:14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
      Daily reminder <input type="checkbox" id="remToggle" ${settings.remindersOn ? "checked":""} style="width:20px;height:20px;accent-color:var(--gold);" />
    </label>
    <label style="font-size:13px;color:#aab4c6;">Reminder time
      <input type="time" id="remTime" value="${settings.reminderTime}" style="display:block;margin-top:6px;width:100%;padding:10px;border-radius:8px;border:1px solid rgba(212,175,90,0.3);background:var(--navy-900);color:var(--paper);" />
    </label>
  `;
  wrap.appendChild(box);

  const saveBtn = el("button","btn btn-primary btn-block","Save reminder");
  saveBtn.style.marginTop="14px";
  saveBtn.onclick = async () => {
    const on = document.getElementById("remToggle").checked;
    const time = document.getElementById("remTime").value;
    if (on && "Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { alert("Enable notifications in your browser/iOS settings to receive reminders."); }
    }
    settings.remindersOn = on; settings.reminderTime = time;
    saveSettings(settings);
    showToast("Reminder saved");
  };
  wrap.appendChild(saveBtn);

  wrap.appendChild(el("div","section-label","Data"));
  const resetBtn = el("button","btn btn-ghost btn-block","Reset all progress");
  resetBtn.onclick = () => {
    if (confirm("This clears all flashcard and quiz progress. Continue?")) {
      progress = {}; saveProgress(progress); render();
      showToast("Progress reset");
    }
  };
  wrap.appendChild(resetBtn);

  wrap.appendChild(el("div","section-label","About"));
  wrap.appendChild(el("p","page-sub","Ledger covers the eight core domains of the FINRA SIE exam: regulatory framework, equity and debt securities, packaged products, options, retirement & taxation, customer accounts, and prohibited practices. Add this app to your home screen for the best experience — see the install guide shared with this app."));

  return wrap;
}

function showToast(msg) {
  const t = el("div","toast", msg);
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

// ---------- Reminder check (runs while app is open) ----------
function checkReminder() {
  if (!settings.remindersOn || !("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const [h,m] = settings.reminderTime.split(":").map(Number);
  const todayKey = now.toDateString();
  const target = new Date(); target.setHours(h, m, 0, 0);
  if (now >= target && settings.lastNotified !== todayKey) {
    new Notification("Time to study for the SIE", { body: "A few flashcards a day keeps the exam stress away. Open Ledger to continue your streak.", icon: "icon-192.png" });
    settings.lastNotified = todayKey;
    saveSettings(settings);
  }
}
setInterval(checkReminder, 60000);
checkReminder();

// ---------- Service worker registration (for installability/offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  });
}

// ---------- Init ----------
render();
