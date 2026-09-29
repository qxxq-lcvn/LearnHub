/* LearnHub — single-page app shell, router, state, course engine and views */
(function () {
  'use strict';

  var LH = window.LH;
  var icon = LH.icon;
  var STORE_KEY = 'learnhub.v2';
  var ASSET_V = '?v=3'; // bump with the ?v= tags in index.html so browsers fetch fresh files

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ================= State (localStorage) ================= */

  function defaults() {
    return {
      lang: null, langSwitched: false, xp: 0,
      done: {}, answered: {}, firstTry: 0, acts: {}, journal: {},
      badges: {}, sim: { runs: 0, maxDepth: 0 }, simLast: null,
      forumRead: [], kit: [],
      exams: {}, certName: '',
      lab: { runs: 0, remission: false },
      plan: {}, planDone: false
    };
  }
  function examState(tid) {
    S.exams[tid] = Object.assign({ best: 0, passed: false, date: '' }, S.exams[tid]);
    return S.exams[tid];
  }
  var S = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = defaults(), s = Object.assign(d, JSON.parse(raw));
        s.sim = Object.assign({ runs: 0, maxDepth: 0 }, s.sim);
        s.lab = Object.assign({ runs: 0, remission: false }, s.lab);
        // older versions stored a single exam (the DRR course)
        if (s.exam) {
          s.exams.drr = { best: s.exam.best || 0, passed: !!s.exam.passed, date: s.exam.date || '' };
          if (s.exam.name && !s.certName) s.certName = s.exam.name;
          delete s.exam;
        }
        return s;
      }
    } catch (e) { /* storage unavailable or corrupted: start fresh */ }
    return defaults();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* private mode: keep in memory */ }
  }

  /* ================= i18n ================= */

  var lang = 'en';

  function lookup(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function t(path, vars) {
    var v = lookup(LH.i18n[lang], path);
    if (v == null) v = lookup(LH.i18n.en, path);
    if (v == null) return path;
    if (typeof v === 'string' && vars) {
      v = v.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    }
    return v;
  }
  /* structure (types, answers, icons) always comes from the English source */
  function en(path) { return lookup(LH.i18n.en, path); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function T(path, vars) { return esc(t(path, vars)); }
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function rich(lines) {
    var html = '', list = [];
    function flush() { if (list.length) { html += '<ul class="leaf-list">' + list.join('') + '</ul>'; list = []; } }
    (Array.isArray(lines) ? lines : [lines]).forEach(function (line) {
      if (typeof line !== 'string') return;
      if (line.indexOf('- ') === 0) list.push('<li>' + inline(line.slice(2)) + '</li>');
      else { flush(); html += '<p>' + inline(line) + '</p>'; }
    });
    flush();
    return html;
  }
  function locale() { return { zh: 'zh-CN', ja: 'ja-JP', km: 'km-KH' }[lang] || 'en'; }
  function fmt(n, digits) {
    digits = digits || 0;
    try {
      return new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits, numberingSystem: 'latn' }).format(n);
    } catch (e) { return n.toFixed(digits); }
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }

  function addScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src; s.onload = function () { resolve(true); }; s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  function loadLang(code) {
    if (!LH.LANGS.some(function (l) { return l.code === code; })) code = 'en';
    if (LH.FONT_LINKS[code] && !document.getElementById('font-' + code)) {
      var link = document.createElement('link');
      link.id = 'font-' + code; link.rel = 'stylesheet'; link.href = LH.FONT_LINKS[code];
      document.head.appendChild(link);
    }
    if (LH.i18n[code] && LH.i18n[code].lessons) return Promise.resolve(code);
    // UI strings first (the file replaces LH.i18n[code]), then the lesson content that extends it
    return addScript('assets/js/i18n/' + code + '.js' + ASSET_V)
      .then(function () { return addScript('assets/js/content/' + code + '.js' + ASSET_V); })
      .then(function () { return addScript('assets/js/content/cancer-' + code + '.js' + ASSET_V); })
      .then(function () { return LH.i18n[code] ? code : 'en'; });
  }

  function setLang(code, userAction) {
    var prev = lang;
    return loadLang(code).then(function (c) {
      lang = c;
      if (userAction && c !== prev) S.langSwitched = true;
      S.lang = c; save();
      document.documentElement.lang = c;
      document.title = t('ui.appName') + ' — ' + t('ui.tagline');
      renderChrome();
      route();
      if (userAction) checkBadges();
    });
  }

  function detectLang() {
    var n = (navigator.language || 'en').toLowerCase().slice(0, 2);
    return LH.LANGS.some(function (l) { return l.code === n; }) ? n : 'en';
  }

  /* ================= Course helpers ================= */

  function topic(id) { return LH.TOPICS.filter(function (x) { return x.id === id; })[0]; }
  function topicMods(tid) { return LH.MODULES.filter(function (m) { return m.topic === tid; }); }
  function moduleOf(lid) { return LH.MODULES.filter(function (m) { return m.lessons.indexOf(lid) !== -1; })[0]; }
  function mod(id) { return LH.MODULES.filter(function (m) { return m.id === id; })[0]; }
  function isDone(lid) { return !!S.done[lid]; }
  function isUnlocked(lid) {
    var m = moduleOf(lid), i = m.lessons.indexOf(lid);
    return i === 0 || isDone(lid) || isDone(m.lessons[i - 1]);
  }
  function modDone(m) { return m.lessons.filter(isDone).length; }
  function modComplete(id) { var m = mod(id); return !!m && modDone(m) === m.lessons.length; }
  /* lessons of one topic, or of every topic when tid is omitted */
  function allLessons(tid) {
    return LH.MODULES.filter(function (m) { return !tid || m.topic === tid; })
      .reduce(function (a, m) { return a.concat(m.lessons); }, []);
  }
  function totalDone(tid) { return allLessons(tid).filter(isDone).length; }
  function nextLesson(tid) { return allLessons(tid).filter(function (l) { return !isDone(l) && isUnlocked(l); })[0] || null; }
  function examUnlocked(tid) { return totalDone(tid) === allLessons(tid).length; }
  function topicTitle(tid) { return t('topics.' + tid + '.title'); }
  function lessonTitle(lid) { return t('lessons.' + lid + '.title'); }

  function levelInfo(xp) {
    var i = 0;
    LH.LEVELS.forEach(function (l, k) { if (xp >= l.xp) i = k; });
    var cur = LH.LEVELS[i], next = LH.LEVELS[i + 1];
    return { cur: cur, next: next, pct: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1 };
  }
  function addXP(n) {
    var before = levelInfo(S.xp).cur.id;
    S.xp += n;
    var after = levelInfo(S.xp).cur.id;
    if (after !== before) {
      setTimeout(function () {
        toast(icon(levelInfo(S.xp).cur.icon) + ' ' + T('ui.levelUp', { level: t('ui.levels.' + after) }), 'sun');
      }, 600);
    }
  }

  function planComplete() {
    var p = S.plan || {};
    return LH.PLAN.required.every(function (k) {
      var v = p[k];
      return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
    });
  }

  var RULES = {
    first_sprout: function () { return totalDone() >= 1; },
    module_m1: function () { return modComplete('m1'); },
    module_m2: function () { return modComplete('m2'); },
    module_m3: function () { return modComplete('m3'); },
    module_m4: function () { return modComplete('m4'); },
    reflective: function () { return topicMods('drr').every(function (m) { return isDone(m.id + 'r'); }); },
    module_c1: function () { return modComplete('c1'); },
    module_c2: function () { return modComplete('c2'); },
    module_c3: function () { return modComplete('c3'); },
    lab_remission: function () { return !!S.lab.remission; },
    exam_cancer: function () { return !!examState('cancer').passed; },
    sharp_eye: function () { return S.firstTry >= 10; },
    wave_scientist: function () { return S.sim.runs >= 1; },
    deep_diver: function () { return S.sim.maxDepth >= 6000; },
    wise_owl: function () { return S.forumRead.length >= 5; },
    ready_pack: function () { return S.kit.length >= LH.KIT.length; },
    plan_maker: function () { return planComplete(); },
    exam_pass: function () { return !!examState('drr').passed; },
    world_voice: function () { return !!S.langSwitched; }
  };

  function checkBadges() {
    var got = [];
    LH.BADGES.forEach(function (b) {
      if (!S.badges[b.id] && RULES[b.id]()) { S.badges[b.id] = Date.now(); addXP(LH.XP.badge); got.push(b); }
    });
    if (got.length) {
      save();
      updateBadgeCounts();
      got.forEach(function (b, i) {
        setTimeout(function () {
          toast(icon(b.icon) + ' ' + T('ui.badges.unlocked', { name: t('badges.' + b.id + '.name') }), 'badge');
        }, 300 + i * 500);
      });
    }
  }

  /* ================= Chrome: header, tab bar, footer ================= */

  var NAV = [
    { id: 'home', href: '#/', icon: 'home' },
    { id: 'emergency', href: '#/topic/drr', icon: 'alert' },
    { id: 'health', href: '#/topic/cancer', icon: 'heart' },
    { id: 'labs', href: '#/labs', icon: 'flask' },
    { id: 'forum', href: '#/forum', icon: 'chat' }
  ];
  /* which nav tab is active for each view */
  function navFor(view, arg) {
    if (view === 'topic' || view === 'exam' || view === 'module' || view === 'lesson') {
      var tid = view === 'topic' || view === 'exam' ? (arg || 'drr')
        : view === 'module' ? (mod(arg) || {}).topic : (moduleOf(arg || '') || {}).topic;
      return (topic(tid) || {}).cat === 'health' ? 'health' : 'emergency';
    }
    if (view === 'plan') return 'emergency';
    if (view === 'lab' || view === 'sim') return 'labs';
    return view;
  }
  var currentArg = null;
  var currentView = 'home';

  function badgeCountText() { return Object.keys(S.badges).length + '/' + LH.BADGES.length; }

  function renderChrome() {
    $('#skip').textContent = t('ui.skip');
    $('#topbar').innerHTML =
      '<div class="wrap topbar-in">' +
        '<a class="brand" href="#/"><span class="brand-mark">' + icon('leaf') + '</span><span class="brand-name">LearnHub</span></a>' +
        '<nav class="nav" aria-label="Main">' + NAV.map(function (n) {
          return '<a href="' + n.href + '" data-nav="' + n.id + '">' + icon(n.icon) + '<span>' + T('ui.nav.' + n.id) + '</span></a>';
        }).join('') + '</nav>' +
        '<div class="actions">' +
          '<button class="pill-btn" type="button" data-open-badges aria-label="' + T('ui.nav.badges') + '">' + icon('trophy') +
            '<span class="hide-sm">' + T('ui.nav.badges') + '</span><span class="count" data-badge-count>' + badgeCountText() + '</span></button>' +
          '<label class="lang-select">' + icon('globe') + '<span class="sr-only">' + T('ui.language') + '</span>' +
            '<select id="lang-select">' + LH.LANGS.map(function (l) {
              return '<option value="' + l.code + '"' + (l.code === lang ? ' selected' : '') + '>' + esc(l.label) + '</option>';
            }).join('') + '</select></label>' +
        '</div>' +
      '</div>';

    $('#tabbar').innerHTML = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.id + '">' + icon(n.icon) + '<span>' + T('ui.nav.' + n.id) + '</span></a>';
    }).join('');

    var tr = t('ui.footer.translation');
    $('#footer').innerHTML =
      '<div class="wrap footer-in">' +
        '<p>' + icon('leaf') + ' <strong>LearnHub</strong> · ' + T('ui.footer.note') + '</p>' +
        (lang !== 'en' && tr ? '<p class="muted small">' + esc(tr) + '</p>' : '') +
      '</div>';

    $('#lang-select').addEventListener('change', function (e) { setLang(e.target.value, true); });
    setActiveNav();
  }

  function updateBadgeCounts() {
    $$('[data-badge-count]').forEach(function (el) { el.textContent = badgeCountText(); });
  }

  function setActiveNav() {
    var navView = navFor(currentView, currentArg);
    $$('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === navView;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-open-badges]')) openBadges();
  });

  /* ================= Toasts & modal ================= */

  function toast(html, kind) {
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast-' + kind : '');
    el.innerHTML = html;
    $('#toasts').appendChild(el);
    setTimeout(function () { el.classList.add('out'); }, 3200);
    setTimeout(function () { el.remove(); }, 3700);
  }

  var modalEl = null, lastFocus = null;
  function openModal(inner, cls) {
    closeModal();
    lastFocus = document.activeElement;
    modalEl = document.createElement('div');
    modalEl.className = 'modal-overlay';
    modalEl.innerHTML = '<div class="modal ' + (cls || '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">' +
      '<button class="modal-close" type="button" aria-label="' + T('ui.close') + '">' + icon('close') + '</button>' + inner + '</div>';
    document.body.appendChild(modalEl);
    document.body.classList.add('no-scroll');
    modalEl.addEventListener('click', function (e) { if (e.target === modalEl) closeModal(); });
    $('.modal-close', modalEl).addEventListener('click', closeModal);
    $('.modal', modalEl).focus();
    return modalEl;
  }
  function closeModal() {
    if (!modalEl) return;
    modalEl.remove(); modalEl = null;
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalEl) closeModal();
    if (e.key === 'Tab' && modalEl) {
      var f = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modalEl);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  function openBadges() {
    var n = Object.keys(S.badges).length;
    var m = openModal(
      '<div class="modal-head"><h2 id="modal-title">' + icon('trophy') + ' ' + T('ui.badges.title') + '</h2>' +
      '<p class="muted">' + T('ui.badges.subtitle', { n: n, total: LH.BADGES.length }) + '</p>' +
      '<div class="bar"><span style="width:' + (n / LH.BADGES.length * 100) + '%"></span></div></div>' +
      '<div class="badge-grid">' + LH.BADGES.map(function (b) {
        var got = !!S.badges[b.id];
        return '<div class="badge ' + (got ? 'got' : 'locked') + '">' +
          '<div class="badge-ic">' + icon(b.icon) + (got ? '' : '<span class="badge-lock">' + icon('lock') + '</span>') + '</div>' +
          '<strong>' + T('badges.' + b.id + '.name') + '</strong><small>' + T('badges.' + b.id + '.desc') + '</small></div>';
      }).join('') + '</div>' +
      '<div class="modal-foot"><button class="btn btn-ghost btn-sm" type="button" id="reset-btn">' + icon('reset') + ' ' + T('ui.badges.reset') + '</button></div>',
      'modal-badges'
    );
    $('#reset-btn', m).addEventListener('click', function () {
      if (!window.confirm(t('ui.badges.resetConfirm'))) return;
      var keepLang = S.lang;
      S = defaults(); S.lang = keepLang; save();
      closeModal();
      renderChrome(); route();
      toast(icon('reset') + ' ' + T('ui.badges.resetDone'));
    });
  }

  function celebrate(title, body, extraBtn) {
    var leaves = '';
    for (var i = 0; i < 16; i++) {
      leaves += '<span class="falling-leaf" style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 1.8).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2).toFixed(2) + 's">' + icon(i % 3 ? 'leaf' : 'sprout') + '</span>';
    }
    var m = openModal(
      '<div class="celebrate">' + leaves +
      '<div class="celebrate-ic">' + icon('trophy') + '</div>' +
      '<h2 id="modal-title">' + esc(title) + '</h2><p>' + esc(body) + '</p>' +
      '<div class="row-center">' + (extraBtn || '') +
      '<button class="btn btn-ghost" type="button" id="celebrate-close">' + T('ui.done.close') + '</button></div></div>',
      'modal-celebrate'
    );
    $('#celebrate-close', m).addEventListener('click', closeModal);
  }

  /* ================= Router ================= */

  var cleanup = null, justUnlocked = null, firstRoute = true;

  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    var main = $('#main');
    var view = parts[0] || 'home';
    currentView = view;
    currentArg = parts[1] || null;
    switch (view) {
      case 'course': return redirect('#/topic/drr'); // older links
      case 'topic': viewTopic(main, parts[1]); break;
      case 'module': viewModule(main, parts[1]); break;
      case 'lesson': viewLesson(main, parts[1]); break;
      case 'exam': viewExam(main, parts[1] || 'drr'); break;
      case 'labs': viewLabs(main); break;
      case 'lab':
        if (parts[1] === 'cancer') viewCancerLab(main);
        else { currentView = 'sim'; viewSim(main); }
        break;
      case 'plan': viewPlan(main); break;
      case 'sim': viewSim(main); break;
      case 'forum': viewForum(main); break;
      default: currentView = 'home'; viewHome(main);
    }
    setActiveNav();
    if (!justUnlocked) window.scrollTo(0, 0);
    if (!firstRoute) main.focus({ preventScroll: true });
    firstRoute = false;
  }
  function redirect(hash) { history.replaceState(null, '', hash); route(); }
  window.addEventListener('hashchange', route);

  /* ================= Shared bits ================= */

  function ring(pct, color) {
    var r = 18, c = 2 * Math.PI * r;
    return '<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="22" cy="22" r="' + r + '" class="ring-fg" stroke="' + color + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct)).toFixed(1) + '"/>' +
      '<text x="22" y="26" text-anchor="middle">' + Math.round(pct * 100) + '%</text></svg>';
  }

  function moduleIndex(m) { return topicMods(m.topic).indexOf(m); }

  /* exam, lab and (for DRR) plan cards shown at the end of a topic */
  function finalCards(tid) {
    var tp = topic(tid), ex = examUnlocked(tid), es = examState(tid);
    var html = '<a class="topic-card final-card" href="#/exam/' + tid + '" style="--accent:#6b4a2f">' +
        '<div class="topic-top"><span class="topic-ic">' + icon('trophy') + '</span>' +
        (es.passed ? '<span class="pill pill-ok">' + icon('check') + ' ' + T('ui.exam.passedShort') + '</span>' : ex ? '' : '<span class="pill">' + icon('lock') + ' ' + T('ui.course.locked') + '</span>') + '</div>' +
        '<h3>' + T('ui.exam.title') + '</h3><p>' + T('ui.exam.desc') + '</p></a>' +
      '<a class="topic-card final-card" href="#/lab/' + tp.lab + '" style="--accent:' + tp.accent + '">' +
        '<div class="topic-top"><span class="topic-ic">' + icon('flask') + '</span></div>' +
        '<h3>' + T('ui.labs.' + tp.lab + '.title') + '</h3><p>' + T('ui.labs.' + tp.lab + '.desc') + '</p></a>';
    if (tid === 'drr') {
      html += '<a class="topic-card final-card" href="#/plan" style="--accent:#5f8a3e">' +
          '<div class="topic-top"><span class="topic-ic">' + icon('map') + '</span>' +
          (planComplete() ? '<span class="pill pill-ok">' + icon('check') + ' ' + T('ui.plan.readyShort') + '</span>' : '') + '</div>' +
          '<h3>' + T('ui.plan.title') + '</h3><p>' + T('ui.plan.desc') + '</p></a>' +
        '<a class="topic-card final-card" href="#/forum" style="--accent:#5f8a3e">' +
          '<div class="topic-top"><span class="topic-ic">' + icon('chat') + '</span></div>' +
          '<h3>' + T('ui.home.forumTitle') + '</h3><p>' + T('ui.home.forumDesc') + '</p></a>';
    }
    return html;
  }

  /* ================= View: Home ================= */

  function heroArt() {
    return '<svg class="hero-svg" viewBox="0 0 400 300" role="img" aria-label="' + T('ui.home.heroAlt') + '">' +
      '<defs><linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9f1"/><stop offset="1" stop-color="#f6f1dc"/></linearGradient>' +
      '<linearGradient id="hSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa3b8"/><stop offset="1" stop-color="#1f6f8b"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#hSky)"/>' +
      '<circle cx="305" cy="72" r="52" fill="#f2b544" opacity=".18"/><circle cx="305" cy="72" r="32" fill="#f2b544"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="90" cy="60" rx="36" ry="11"/><ellipse cx="116" cy="51" rx="22" ry="12"/><ellipse cx="220" cy="42" rx="24" ry="8"/></g>' +
      '<path d="M0 175 L60 118 L110 158 L185 88 L255 150 L320 112 L400 165 V300 H0Z" fill="#a9cc86"/>' +
      '<path d="M185 88 L203 105 L192 103 L185 112 L177 102 L168 104Z" fill="#fbf8ef" opacity=".9"/>' +
      '<path d="M0 205 Q95 150 205 195 T400 190 V300 H0Z" fill="#6b9a47"/>' +
      '<g fill="#2d5a3d">' +
        '<path d="M40 190 l12 -30 12 30z"/><path d="M58 186 l10 -24 10 24z"/><path d="M300 192 l12 -30 12 30z"/><path d="M322 190 l9 -22 9 22z"/><path d="M345 193 l11 -27 11 27z"/>' +
      '</g>' +
      '<g class="hero-waves"><path d="M-100 238 q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V300 H-100Z" fill="url(#hSea)"/>' +
      '<path d="M-100 256 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#bfe6ee" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>' +
      '</svg>';
  }

  /* big card for a topic that has a course */
  function topicCard(tp) {
    var total = allLessons(tp.id).length, d = totalDone(tp.id), nxt = nextLesson(tp.id);
    var cta = !d ? T('ui.home.start') : nxt ? T('ui.home.continue') : T('ui.home.review');
    var href = nxt ? '#/lesson/' + nxt : '#/topic/' + tp.id;
    return '<div class="card topic-feature" style="--accent:' + tp.accent + '">' +
      '<a class="tf-head" href="#/topic/' + tp.id + '"><span class="topic-ic">' + icon(tp.icon) + '</span>' +
        '<div><h3>' + T('topics.' + tp.id + '.title') + '</h3><p>' + T('topics.' + tp.id + '.desc') + '</p></div>' + ring(d / total, tp.accent) + '</a>' +
      '<div class="tf-meta">' +
        '<span>' + icon('layers') + ' ' + T('ui.home.modulesN', { n: topicMods(tp.id).length }) + '</span>' +
        '<span>' + icon('signpost') + ' ' + T('ui.course.lessonsDone', { done: d, total: total }) + '</span>' +
        (examState(tp.id).passed ? '<span class="ok">' + icon('check') + ' ' + T('ui.exam.passedShort') + '</span>' : '') +
      '</div>' +
      '<div class="btn-row">' +
        '<a class="btn btn-primary btn-sm" href="' + href + '">' + icon('sprout') + ' ' + cta + '</a>' +
        '<a class="btn btn-ghost btn-sm" href="#/lab/' + tp.lab + '">' + icon('flask') + ' ' + T('ui.home.openLab') + '</a>' +
        '<a class="btn btn-ghost btn-sm" href="#/exam/' + tp.id + '">' + icon('trophy') + ' ' + T('ui.exam.title') + '</a>' +
      '</div></div>';
  }

  function viewHome(main) {
    var L = levelInfo(S.xp);
    main.innerHTML =
      '<section class="wrap hero">' +
        '<div class="hero-text">' +
          '<span class="eyebrow">' + icon('leaf') + ' ' + T('ui.tagline') + '</span>' +
          '<h1>' + T('ui.home.hello') + '</h1>' +
          '<p class="lead">' + T('ui.home.intro') + '</p>' +
          '<div class="btn-row">' + LH.CATEGORIES.map(function (c) {
            return '<a class="btn ' + (c.id === 'emergency' ? 'btn-primary' : 'btn-sea') + '" href="#cat-' + c.id + '" data-jump="cat-' + c.id + '">' + icon(c.icon) + ' ' + T('ui.categories.' + c.id + '.title') + '</a>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="hero-art">' + heroArt() + '</div>' +
      '</section>' +

      '<section class="wrap">' +
        '<div class="card growth">' +
          '<div class="growth-level"><span class="level-ic">' + icon(L.cur.icon) + '</span>' +
            '<div><small class="muted">' + T('ui.home.yourGrowth') + '</small>' +
            '<h2>' + T('ui.home.level') + ': ' + T('ui.levels.' + L.cur.id) + '</h2>' +
            '<div class="bar"><span style="width:' + (L.pct * 100).toFixed(1) + '%"></span></div>' +
            '<small class="muted">' + (L.next ? T('ui.home.toNext', { xp: L.next.xp - S.xp, level: t('ui.levels.' + L.next.id) }) : T('ui.home.maxLevel')) + '</small></div>' +
          '</div>' +
          '<div class="growth-stats">' +
            '<div><strong>' + S.xp + '</strong><small>' + T('ui.home.xpStat') + '</small></div>' +
            '<div><strong>' + totalDone() + '/' + allLessons().length + '</strong><small>' + T('ui.home.lessonsStat') + '</small></div>' +
            '<div><strong>' + Object.keys(S.badges).length + '</strong><small>' + T('ui.home.badgesStat') + '</small></div>' +
          '</div>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-open-badges>' + icon('trophy') + ' ' + T('ui.home.viewBadges') + '</button>' +
        '</div>' +
      '</section>' +

      LH.CATEGORIES.map(function (c) {
        var live = LH.TOPICS.filter(function (tp) { return tp.cat === c.id && tp.available; });
        var soon = LH.TOPICS.filter(function (tp) { return tp.cat === c.id && !tp.available; });
        return '<section class="wrap cat-section cat-' + c.id + '" id="cat-' + c.id + '">' +
          '<div class="cat-head"><span class="cat-badge">' + icon(c.icon) + '</span><div>' +
            '<h2>' + T('ui.categories.' + c.id + '.title') + '</h2><p class="muted">' + T('ui.categories.' + c.id + '.desc') + '</p></div></div>' +
          '<div class="topic-feature-grid">' + live.map(topicCard).join('') + '</div>' +
          (soon.length ? '<h3 class="soon-title">' + T('ui.home.comingSoon') + '</h3><div class="hazard-row">' + soon.map(function (h) {
            return '<div class="hazard" style="--accent:' + h.accent + '"><span class="topic-ic">' + icon(h.icon) + '</span>' +
              '<strong>' + T('topics.' + h.id + '.title') + '</strong></div>';
          }).join('') + '</div>' : '') +
        '</section>';
      }).join('');

    $$('[data-jump]', main).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute('data-jump'));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ================= View: Labs ================= */

  function viewLabs(main) {
    main.innerHTML =
      '<section class="wrap page-head">' +
        '<div class="page-title" style="--accent:#1f6f8b"><span class="topic-ic">' + icon('flask') + '</span>' +
          '<div><h1>' + T('ui.labs.title') + '</h1><p class="muted">' + T('ui.labs.intro') + '</p></div></div>' +
      '</section>' +
      '<section class="wrap feature-row">' + LH.TOPICS.filter(function (tp) { return tp.available; }).map(function (tp) {
        return '<a class="feature ' + (tp.cat === 'health' ? 'feature-rose' : 'feature-sea') + '" href="#/lab/' + tp.lab + '"><span class="feature-ic">' + icon(tp.cat === 'health' ? 'cell' : 'wave') + '</span>' +
          '<div><small>' + T('ui.categories.' + tp.cat + '.title') + '</small><h3>' + T('ui.labs.' + tp.lab + '.title') + '</h3><p>' + T('ui.labs.' + tp.lab + '.desc') + '</p></div>' + icon('arrowRight', 'go') + '</a>';
      }).join('') + '</section>';
  }

  /* ================= View: Topic overview ================= */

  function lessonStatus(lid) { return isDone(lid) ? 'done' : isUnlocked(lid) ? 'current' : 'locked'; }

  function viewTopic(main, tid) {
    var tp = topic(tid);
    if (!tp || !tp.available) return redirect('#/');
    var mods = topicMods(tid);
    var pct = Math.round(totalDone(tid) / allLessons(tid).length * 100);
    main.innerHTML =
      '<section class="wrap page-head">' +
        '<a class="back" href="#/">' + icon('arrowLeft') + ' ' + T('ui.categories.' + tp.cat + '.title') + '</a>' +
        '<div class="page-title" style="--accent:' + tp.accent + '"><span class="topic-ic">' + icon(tp.icon) + '</span>' +
          '<div><h1>' + T('topics.' + tid + '.title') + '</h1><p class="muted">' + T('topics.' + tid + '.intro') + '</p></div></div>' +
        '<div class="progress-line"><div class="bar"><span style="width:' + pct + '%"></span></div><strong>' + T('ui.learn.progress', { pct: pct }) + '</strong></div>' +
        (tp.cat === 'health' ? '<p class="note">' + icon('heart') + ' ' + T('ui.health.disclaimer') + '</p>' : '') +
      '</section>' +
      '<section class="wrap course-list">' + mods.map(function (m, i) {
        return '<div class="card course-mod" style="--accent:' + m.accent + '">' +
          '<a class="course-mod-head" href="#/module/' + m.id + '"><span class="topic-ic">' + icon(m.icon) + '</span>' +
            '<div><small class="eyebrow-sm">' + T('ui.course.moduleN', { n: i + 1 }) + '</small><h2>' + T('modules.' + m.id + '.title') + '</h2></div>' +
            ring(modDone(m) / m.lessons.length, m.accent) + '</a>' +
          '<ol class="lesson-list">' + m.lessons.map(function (lid) {
            var st = lessonStatus(lid);
            var inner = '<span class="ll-ic ' + st + '">' + icon(st === 'done' ? 'check' : st === 'locked' ? 'lock' : LH.LESSON_ICONS[lid]) + '</span>' +
              '<span class="ll-title">' + esc(lessonTitle(lid)) + '</span>' +
              '<span class="ll-min">' + T('ui.lesson.minutes', { n: en('lessons.' + lid + '.minutes') || 5 }) + '</span>';
            return '<li>' + (st === 'locked' ? '<span class="ll locked">' + inner + '</span>' : '<a class="ll" href="#/lesson/' + lid + '">' + inner + '</a>') + '</li>';
          }).join('') + '</ol></div>';
      }).join('') +
      '<div class="topic-grid final-grid">' + finalCards(tid) + '</div></section>';
  }

  /* ================= View: Module trail ================= */

  function viewModule(main, mid) {
    var m = mod(mid);
    if (!m) return redirect('#/');
    var mods = topicMods(m.topic), mi = mods.indexOf(m);
    var ls = m.lessons, n = ls.length;
    var d = modDone(m), pct = Math.round((d / n) * 100);
    var GAP = 132, TOP = 70, Hh = TOP * 2 + GAP * (n - 1);
    var XS = [50, 78, 50, 22];
    var pos = ls.map(function (s, i) { return { x: XS[i % 4], y: TOP + i * GAP }; });

    var segs = '';
    for (var i = 0; i < n - 1; i++) {
      var a = pos[i], b = pos[i + 1];
      var dPath = 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + (a.y + GAP / 2) + ' ' + b.x + ' ' + (b.y - GAP / 2) + ' ' + b.x + ' ' + b.y;
      segs += '<path d="' + dPath + '" class="trail-bed" vector-effect="non-scaling-stroke"/>' +
        '<path d="' + dPath + '" class="trail-line' + (isDone(ls[i]) ? ' walked' : '') + '" vector-effect="non-scaling-stroke"/>';
    }
    var deco = '';
    for (var j = 0; j < n - 1; j++) {
      var mx = (pos[j].x + pos[j + 1].x) / 2, my = (pos[j].y + pos[j + 1].y) / 2;
      deco += '<span class="deco" style="left:' + (mx >= 50 ? 9 : 91) + '%;top:' + my + 'px">' + icon(j % 2 ? 'tree' : 'sprout') + '</span>';
    }

    var nodes = ls.map(function (lid, k) {
      var st = lessonStatus(lid);
      var p = pos[k], sideCls = p.x > 50 ? 'side-left' : 'side-right';
      var title = esc(lessonTitle(lid));
      var statusText = st === 'done' ? t('ui.learn.done') : st === 'locked' ? t('ui.learn.locked') : t('ui.learn.start');
      return '<div class="trail-node ' + st + ' ' + sideCls + (justUnlocked === lid ? ' pop' : '') + '" style="left:' + p.x + '%;top:' + p.y + 'px" data-step="' + lid + '">' +
        '<button class="stone" type="button" data-lid="' + lid + '" aria-label="' + title + ' — ' + esc(statusText) + '">' +
          icon(st === 'locked' ? 'lock' : LH.LESSON_ICONS[lid]) +
          (st === 'done' ? '<span class="tick">' + icon('check') + '</span>' : '') +
        '</button>' +
        '<div class="node-label"><small>' + T('ui.learn.stepN', { n: k + 1 }) + '</small><strong>' + title + '</strong>' +
          (st === 'current' ? '<em>' + icon('play') + ' ' + T('ui.learn.start') + '</em>' : '') + '</div>' +
      '</div>';
    }).join('');

    var nextMod = mods[mi + 1];
    main.innerHTML =
      '<section class="wrap page-head">' +
        '<a class="back" href="#/topic/' + m.topic + '">' + icon('arrowLeft') + ' ' + T('topics.' + m.topic + '.title') + '</a>' +
        '<div class="page-title" style="--accent:' + m.accent + '"><span class="topic-ic">' + icon(m.icon) + '</span>' +
          '<div><small class="eyebrow-sm">' + T('ui.course.moduleN', { n: mi + 1 }) + '</small><h1>' + T('modules.' + mid + '.title') + '</h1><p class="muted">' + T('modules.' + mid + '.desc') + '</p></div></div>' +
        '<div class="progress-line"><div class="bar"><span style="width:' + pct + '%"></span></div><strong>' + T('ui.learn.progress', { pct: pct }) + '</strong></div>' +
        '<p class="hint">' + icon('sprout') + ' ' + T('ui.learn.hint') + '</p>' +
      '</section>' +
      '<section class="wrap"><div class="trail-wrap" aria-label="' + T('ui.learn.trail') + '">' +
        '<div class="trail" style="height:' + Hh + 'px">' +
          '<svg class="trail-svg" viewBox="0 0 100 ' + Hh + '" preserveAspectRatio="none" aria-hidden="true">' + segs + '</svg>' +
          deco + nodes +
        '</div></div>' +
        '<div class="row-center module-foot">' +
          (nextMod ? '<a class="btn btn-ghost" href="#/module/' + nextMod.id + '">' + T('ui.course.nextModule') + ' ' + icon('arrowRight') + '</a>'
                   : '<a class="btn btn-ghost" href="#/exam/' + m.topic + '">' + icon('trophy') + ' ' + T('ui.exam.title') + '</a>') +
        '</div></section>';

    $$('.stone', main).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lid = btn.getAttribute('data-lid');
        if (!isUnlocked(lid)) { toast(icon('lock') + ' ' + T('ui.learn.locked')); return; }
        location.hash = '#/lesson/' + lid;
      });
    });

    if (justUnlocked) {
      var el = $('[data-step="' + justUnlocked + '"]', main);
      justUnlocked = null;
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    }
  }

  /* ================= Lesson blocks ================= */

  /*
   * Each renderer returns { html, bind(el, done), required }.
   * `P(sub)` returns localized text at lessons.<lid>.blocks.<i>.<sub>, `E(sub)` the English structure.
   * Interactive blocks call done() once complete; the lesson unlocks "Complete" when all are done.
   */
  var BLOCKS = {};

  BLOCKS.text = function (P) {
    return { html: (P('title') !== null ? '<h2 class="block-title">' + esc(P('title')) + '</h2>' : '') + '<div class="card lesson">' + rich(P('body')) + '</div>' };
  };

  BLOCKS.fact = function (P) {
    return { html: '<aside class="fact">' + icon('sun') + '<div><strong>' + esc(P('title') || t('ui.reader.didYouKnow')) + '</strong><p>' + inline(P('text')) + '</p></div></aside>' };
  };

  BLOCKS.quote = function (P) {
    return { html: '<figure class="quote">' + icon('quote') + '<blockquote>' + inline(P('text')) + '</blockquote>' + (P('by') ? '<figcaption>— ' + esc(P('by')) + '</figcaption>' : '') + '</figure>' };
  };

  BLOCKS.stats = function (P, E) {
    return {
      html: (P('title') ? '<h2 class="block-title">' + esc(P('title')) + '</h2>' : '') +
        '<div class="stat-grid">' + E('items').map(function (it, i) {
          return '<div class="stat-tile"><strong>' + esc(P('items.' + i + '.value')) + '</strong><span>' + esc(P('items.' + i + '.label')) + '</span></div>';
        }).join('') + '</div>' + (P('source') ? '<p class="source">' + esc(P('source')) + '</p>' : '')
    };
  };

  BLOCKS.timeline = function (P, E) {
    return {
      html: '<h2 class="block-title">' + icon('clock') + ' ' + esc(P('title')) + '</h2>' +
        '<ol class="timeline">' + E('items').map(function (it, i) {
          return '<li><span class="tl-time">' + esc(P('items.' + i + '.time')) + '</span><div class="tl-body"><strong>' + esc(P('items.' + i + '.title')) + '</strong>' +
            (P('items.' + i + '.text') ? '<p>' + inline(P('items.' + i + '.text')) + '</p>' : '') + '</div></li>';
        }).join('') + '</ol>'
    };
  };

  BLOCKS.cards = function (P, E) {
    return {
      html: '<h2 class="block-title">' + icon('layers') + ' ' + esc(P('title')) + '</h2><p class="muted small">' + T('ui.blocks.flipHint') + '</p>' +
        '<div class="flip-grid">' + E('items').map(function (it, i) {
          return '<button class="flip" type="button" aria-pressed="false"><span class="flip-in">' +
            '<span class="flip-front">' + icon(it.icon || 'leaf') + '<strong>' + esc(P('items.' + i + '.title')) + '</strong></span>' +
            '<span class="flip-back">' + inline(P('items.' + i + '.text')) + '</span></span></button>';
        }).join('') + '</div>',
      bind: function (el) {
        $$('.flip', el).forEach(function (b) {
          b.addEventListener('click', function () {
            var on = b.classList.toggle('flipped'); b.setAttribute('aria-pressed', on);
          });
        });
      }
    };
  };

  BLOCKS.compare = function (P, E) {
    return {
      html: '<h2 class="block-title">' + icon('layers') + ' ' + esc(P('title')) + '</h2>' +
        '<div class="compare-cols">' + E('cols').map(function (c, i) {
          return '<div class="card compare-col" style="--accent:' + (c.color || '#2d5a3d') + '"><h3>' + icon(c.icon || 'leaf') + ' ' + esc(P('cols.' + i + '.title')) + '</h3>' +
            rich(P('cols.' + i + '.items').map(function (x) { return '- ' + x; })) + '</div>';
        }).join('') + '</div>'
    };
  };

  BLOCKS.cycle = function (P, E) {
    var ph = E('phases'), n = ph.length, R = 120, cx = 160, cy = 160;
    var arcs = ph.map(function (p, i) {
      var a0 = (i / n) * 2 * Math.PI - Math.PI / 2 + 0.04, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2 - 0.04;
      var r0 = 70;
      function pt(r, a) { return (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); }
      var d = 'M' + pt(R, a0) + ' A' + R + ' ' + R + ' 0 0 1 ' + pt(R, a1) + ' L' + pt(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + pt(r0, a0) + 'Z';
      var am = (a0 + a1) / 2;
      var ix = cx + 95 * Math.cos(am) - 12, iy = cy + 95 * Math.sin(am) - 12;
      return '<g class="cyc-seg" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(P('phases.' + i + '.name')) + '">' +
        '<path d="' + d + '" fill="' + p.color + '"/>' +
        '<svg x="' + ix.toFixed(1) + '" y="' + iy.toFixed(1) + '" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + LH.ICONS[p.icon] + '</svg></g>';
    }).join('');
    return {
      html: '<h2 class="block-title">' + icon('cycle') + ' ' + esc(P('title')) + '</h2><p class="muted small">' + T('ui.blocks.cycleHint') + '</p>' +
        '<div class="cycle-wrap card"><svg class="cycle-svg" viewBox="0 0 320 320">' + arcs +
          '<circle cx="160" cy="160" r="62" fill="#fbf8ef"/><text x="160" y="156" text-anchor="middle" class="cyc-center">' + esc(P('center')) + '</text>' +
          '<path d="M150 172 a12 12 0 1 0 20 0" fill="none" stroke="#5f8a3e" stroke-width="2.5" stroke-linecap="round"/></svg>' +
        '<div class="cycle-detail" aria-live="polite"></div></div>',
      bind: function (el) {
        var detail = $('.cycle-detail', el);
        function show(i) {
          $$('.cyc-seg', el).forEach(function (g) { g.classList.toggle('on', +g.getAttribute('data-i') === i); });
          detail.innerHTML = '<span class="pill" style="background:' + ph[i].color + ';color:#fff">' + esc(P('phases.' + i + '.when')) + '</span>' +
            '<h3>' + esc(P('phases.' + i + '.name')) + '</h3>' + rich(P('phases.' + i + '.text'));
        }
        $$('.cyc-seg', el).forEach(function (g) {
          var i = +g.getAttribute('data-i');
          g.addEventListener('click', function () { show(i); });
          g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
        });
        show(0);
      }
    };
  };

  BLOCKS.risk = function (P) {
    var keys = ['hazard', 'exposure', 'vulnerability', 'capacity'];
    return {
      html: '<h2 class="block-title">' + icon('target') + ' ' + esc(P('title')) + '</h2>' +
        '<div class="card risk"><p class="risk-eq">' + esc(P('equation')) + '</p>' +
        keys.map(function (k) {
          return '<div class="field"><label for="rk-' + k + '">' + esc(P('labels.' + k)) + '</label><output data-out="' + k + '"></output>' +
            '<input type="range" id="rk-' + k + '" data-k="' + k + '" min="1" max="5" step="1" value="3"><small class="muted">' + esc(P('help.' + k)) + '</small></div>';
        }).join('') +
        '<div class="risk-meter"><div class="risk-track"><span></span></div><strong class="risk-label"></strong></div>' +
        '<p class="muted small">' + esc(P('note')) + '</p></div>',
      bind: function (el) {
        var v = { hazard: 3, exposure: 3, vulnerability: 3, capacity: 3 };
        var levels = P('levels');
        function upd() {
          keys.forEach(function (k) { $('[data-out="' + k + '"]', el).textContent = v[k] + ' / 5'; });
          var score = (v.hazard * v.exposure * v.vulnerability) / v.capacity; // 0.2 .. 125
          var pct = Math.min(1, Math.log(score / 0.2) / Math.log(125 / 0.2));
          var li = pct < 0.4 ? 0 : pct < 0.6 ? 1 : pct < 0.8 ? 2 : 3;
          var bar = $('.risk-track span', el);
          bar.style.width = (pct * 100).toFixed(0) + '%';
          bar.setAttribute('data-l', li);
          $('.risk-label', el).textContent = levels[li];
        }
        $$('input', el).forEach(function (inp) {
          inp.addEventListener('input', function () { v[inp.getAttribute('data-k')] = +inp.value; upd(); });
        });
        upd();
      }
    };
  };

  BLOCKS.tour = function (P, E, key) {
    var sc = LH.SCENES[E('scene')], stops = E('stops');
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('pin') + ' ' + esc(P('title')) + '</h2><p class="muted small">' + T('ui.blocks.tourHint', { n: stops.length }) + '</p>' +
        '<div class="tour card"><div class="tour-stage">' + sc.svg +
          stops.map(function (s, i) {
            var p = sc.spots[i];
            return '<button class="spot" type="button" data-i="' + i + '" style="left:' + (p[0] / 8) + '%;top:' + (p[1] / 4.2) + '%" aria-label="' + esc(P('stops.' + i + '.title')) + '">' + (i + 1) + '</button>';
          }).join('') +
        '</div><div class="tour-panel" aria-live="polite"></div>' +
        '<div class="tour-nav"><span class="tour-count"></span><button class="btn btn-sea btn-sm tour-next" type="button">' + T('ui.blocks.nextStop') + ' ' + icon('arrowRight') + '</button></div></div>',
      bind: function (el, done) {
        var seen = {}, cur = -1;
        function show(i) {
          cur = i; seen[i] = true;
          $$('.spot', el).forEach(function (b) {
            var j = +b.getAttribute('data-i');
            b.classList.toggle('on', j === i); b.classList.toggle('seen', !!seen[j]);
          });
          $('.tour-panel', el).innerHTML = '<small class="eyebrow-sm">' + T('ui.blocks.stopN', { n: i + 1, total: stops.length }) + '</small>' +
            '<h3>' + esc(P('stops.' + i + '.title')) + '</h3>' + rich(P('stops.' + i + '.text'));
          var n = Object.keys(seen).length;
          $('.tour-count', el).textContent = T('ui.blocks.visited', { n: n, total: stops.length });
          if (n === stops.length) done();
        }
        $$('.spot', el).forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-i')); }); });
        $('.tour-next', el).addEventListener('click', function () { show((cur + 1) % stops.length); });
        show(0);
      }
    };
  };

  BLOCKS.map = function (P, E) {
    var cfg = LH.MAPS[E('map')], pins = E('pins');
    return {
      html: '<h2 class="block-title">' + icon('map') + ' ' + esc(P('title')) + '</h2><p class="muted small">' + T('ui.blocks.mapHint') + '</p>' +
        '<div class="card map-card"><div class="map-stage"><div class="map-loading">' + icon('globe') + '</div></div>' +
        '<div class="map-panel" aria-live="polite"></div>' +
        '<div class="chips map-chips">' + pins.map(function (p, i) {
          return '<button class="chip" type="button" data-pin="' + i + '">' + icon('pin') + ' ' + esc(P('pins.' + i + '.label')) + '</button>';
        }).join('') + '</div></div>',
      bind: function (el) {
        function show(i) {
          $$('[data-pin]', el).forEach(function (b) { b.classList.toggle('active', +b.getAttribute('data-pin') === i); });
          $('.map-panel', el).innerHTML = '<h3>' + esc(P('pins.' + i + '.label')) + '</h3><p>' + inline(P('pins.' + i + '.text')) + '</p>';
        }
        $$('[data-pin]', el).forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-pin')); }); });
        show(0);
        drawMap($('.map-stage', el), cfg, pins, show);
      }
    };
  };

  var mapData = null;
  function drawMap(stage, cfg, pins, onPick) {
    var libs = window.d3 && window.topojson ? Promise.resolve() :
      addScript('https://cdn.jsdelivr.net/npm/d3-array@3/dist/d3-array.min.js')
        .then(function () { return addScript('https://cdn.jsdelivr.net/npm/d3-geo@3/dist/d3-geo.min.js'); })
        .then(function () { return addScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js'); });
    libs.then(function () {
      if (!window.d3 || !window.d3.geoPath || !window.topojson) throw new Error('map libs');
      return mapData || fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function (r) { return r.json(); });
    }).then(function (world) {
      mapData = world;
      var W = 800, H = 460;
      var proj = d3.geoEquirectangular().rotate([-cfg.center[0], 0]).center([0, cfg.center[1]]).scale(W / (2 * Math.PI) * 2.3 * cfg.scale).translate([W / 2, H / 2]);
      var path = d3.geoPath(proj);
      var land = topojson.feature(world, world.objects.countries);
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="map-svg" aria-hidden="true"><rect width="' + W + '" height="' + H + '" fill="#d8eef3"/>' +
        '<path d="' + path(d3.geoGraticule10()) + '" fill="none" stroke="#bfe0e7" stroke-width=".6"/>' +
        '<path d="' + path(land) + '" fill="#b9d49a" stroke="#fbf8ef" stroke-width=".6"/></svg>';
      stage.innerHTML = svg + pins.map(function (p, i) {
        var xy = proj(cfg.pins[i]);
        return '<button class="map-pin" type="button" data-pin="' + i + '" style="left:' + (xy[0] / W * 100).toFixed(2) + '%;top:' + (xy[1] / H * 100).toFixed(2) + '%" aria-label="' + (i + 1) + '">' + (i + 1) + '</button>';
      }).join('');
      $$('.map-pin', stage).forEach(function (b) { b.addEventListener('click', function () { onPick(+b.getAttribute('data-pin')); }); });
    }).catch(function () {
      stage.innerHTML = '<p class="muted small map-off">' + icon('globe') + ' ' + T('ui.blocks.mapOffline') + '</p>';
    });
  }

  function markActivity(key) {
    if (!S.acts[key]) { S.acts[key] = 1; save(); }
  }

  BLOCKS.quiz = function (P, E, key) {
    var qs = E('questions');
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('leaf') + ' ' + esc(P('title') || t('ui.reader.quiz')) + '</h2>' +
        '<div class="quiz">' + qs.map(function (q, qi) {
          return '<div class="q card" data-q="' + qi + '">' +
            (qs.length > 1 ? '<small class="q-num">' + T('ui.reader.questionN', { n: qi + 1 }) + '</small>' : '') +
            '<h3>' + esc(P('questions.' + qi + '.q')) + '</h3>' +
            '<div class="opts">' + P('questions.' + qi + '.o').map(function (o, oi) {
              return '<button class="opt" type="button" data-o="' + oi + '"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span></button>';
            }).join('') + '</div><div class="feedback" aria-live="polite"></div></div>';
        }).join('') + '</div>',
      bind: function (el, done) {
        var solved = qs.map(function () { return false; });
        $$('.q', el).forEach(function (qEl) {
          var qi = +qEl.getAttribute('data-q');
          var fb = $('.feedback', qEl);
          $$('.opt', qEl).forEach(function (oEl) {
            oEl.addEventListener('click', function () {
              if (solved[qi]) return;
              var oi = +oEl.getAttribute('data-o');
              var akey = key + '.' + qi;
              if (oi === qs[qi].a) {
                solved[qi] = true;
                oEl.classList.add('correct');
                $$('.opt', qEl).forEach(function (b) { b.disabled = true; });
                var chip = '';
                if (!S.answered[akey]) {
                  S.answered[akey] = 1; S.firstTry++; addXP(LH.XP.firstTry);
                  chip = '<span class="xp-chip">+' + LH.XP.firstTry + ' XP</span>';
                  save(); checkBadges();
                }
                fb.className = 'feedback ok';
                fb.innerHTML = icon('check') + '<div><strong>' + T('ui.reader.correct') + '</strong> ' + chip + '<p>' + inline(P('questions.' + qi + '.e')) + '</p></div>';
                if (solved.every(Boolean)) done();
              } else {
                if (!S.answered[akey]) { S.answered[akey] = 2; save(); }
                oEl.classList.add('wrong'); oEl.disabled = true;
                fb.className = 'feedback bad';
                fb.innerHTML = icon('close') + '<div><strong>' + T('ui.reader.wrong') + '</strong></div>';
              }
            });
          });
        });
      }
    };
  };

  BLOCKS.sort = function (P, E, key) {
    var items = E('items'), cats = P('cats');
    var order = shuffle(items.map(function (x, i) { return i; }));
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('shuffle') + ' ' + esc(P('title')) + '</h2><p>' + inline(P('prompt')) + '</p>' +
        '<div class="card sort"><div class="sort-bins">' + cats.map(function (c, ci) {
          return '<div class="sort-bin" data-bin="' + ci + '"><strong>' + esc(c) + '</strong><div class="sort-drop"></div></div>';
        }).join('') + '</div>' +
        '<ul class="sort-items">' + order.map(function (i) {
          return '<li class="sort-item" data-i="' + i + '"><span>' + esc(P('items.' + i + '.text')) + '</span><span class="sort-btns">' +
            cats.map(function (c, ci) { return '<button class="chip chip-sm" type="button" data-c="' + ci + '">' + esc(c) + '</button>'; }).join('') + '</span></li>';
        }).join('') + '</ul><p class="sort-status muted small" aria-live="polite"></p></div>',
      bind: function (el, done) {
        var left = items.length, mistakes = 0;
        $$('.sort-item', el).forEach(function (li) {
          var i = +li.getAttribute('data-i');
          $$('[data-c]', li).forEach(function (b) {
            b.addEventListener('click', function () {
              var c = +b.getAttribute('data-c');
              if (c === items[i].cat) {
                var chip = document.createElement('span');
                chip.className = 'sorted'; chip.innerHTML = icon('check') + ' ' + esc(P('items.' + i + '.text'));
                $('[data-bin="' + c + '"] .sort-drop', el).appendChild(chip);
                li.remove(); left--;
                $('.sort-status', el).textContent = '';
                if (!left) {
                  $('.sort-status', el).innerHTML = icon('check') + ' ' + T('ui.blocks.sortDone');
                  if (!mistakes && !S.acts[key]) { addXP(LH.XP.activity); toast(icon('sprout') + ' +' + LH.XP.activity + ' XP'); }
                  markActivity(key); done();
                }
              } else {
                mistakes++;
                b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500);
                $('.sort-status', el).textContent = t('ui.blocks.sortWrong');
              }
            });
          });
        });
      }
    };
  };

  BLOCKS.order = function (P, E, key) {
    var n = E('items').length;
    var order = shuffle(E('items').map(function (x, i) { return i; }));
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('signpost') + ' ' + esc(P('title')) + '</h2><p>' + inline(P('prompt')) + '</p>' +
        '<div class="card order"><ol class="order-done"></ol><div class="order-pool">' + order.map(function (i) {
          return '<button class="order-item" type="button" data-i="' + i + '">' + esc(P('items.' + i)) + '</button>';
        }).join('') + '</div><p class="order-status muted small" aria-live="polite">' + T('ui.blocks.orderHint') + '</p></div>',
      bind: function (el, done) {
        var next = 0, mistakes = 0;
        $$('.order-item', el).forEach(function (b) {
          b.addEventListener('click', function () {
            var i = +b.getAttribute('data-i');
            if (i === next) {
              var li = document.createElement('li'); li.textContent = P('items.' + i);
              $('.order-done', el).appendChild(li);
              b.remove(); next++;
              if (next === n) {
                $('.order-status', el).innerHTML = icon('check') + ' ' + T('ui.blocks.orderDone');
                if (!mistakes && !S.acts[key]) { addXP(LH.XP.activity); toast(icon('sprout') + ' +' + LH.XP.activity + ' XP'); }
                markActivity(key); done();
              } else $('.order-status', el).textContent = t('ui.blocks.orderHint');
            } else {
              mistakes++;
              b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500);
              $('.order-status', el).textContent = t('ui.blocks.orderWrong');
            }
          });
        });
      }
    };
  };

  BLOCKS.scenario = function (P, E, key) {
    var ch = E('choices');
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('compass') + ' ' + esc(P('title')) + '</h2>' +
        '<div class="card scenario"><p class="scenario-text">' + inline(P('text')) + '</p><p><strong>' + T('ui.blocks.whatWouldYouDo') + '</strong></p>' +
        '<div class="opts">' + ch.map(function (c, i) {
          return '<button class="opt" type="button" data-i="' + i + '"><span class="opt-key">' + String.fromCharCode(65 + i) + '</span><span>' + esc(P('choices.' + i + '.text')) + '</span></button>';
        }).join('') + '</div><div class="feedback" aria-live="polite"></div></div>',
      bind: function (el, done) {
        var fb = $('.feedback', el), solved = false;
        $$('.opt', el).forEach(function (b) {
          b.addEventListener('click', function () {
            if (solved) return;
            var i = +b.getAttribute('data-i'), good = !!ch[i].good;
            b.classList.add(good ? 'correct' : 'wrong');
            fb.className = 'feedback ' + (good ? 'ok' : 'bad');
            fb.innerHTML = icon(good ? 'check' : 'alert') + '<div><p>' + inline(P('choices.' + i + '.result')) + '</p>' + (good ? '' : '<p><em>' + T('ui.blocks.tryAnother') + '</em></p>') + '</div>';
            if (good) { solved = true; $$('.opt', el).forEach(function (x) { x.disabled = true; }); markActivity(key); done(); }
            else b.disabled = true;
          });
        });
      }
    };
  };

  BLOCKS.reflect = function (P, E, key, lid) {
    var prompts = P('prompts');
    return {
      required: true,
      html: '<h2 class="block-title">' + icon('pencil') + ' ' + esc(P('title') || t('ui.blocks.reflectTitle')) + '</h2>' +
        '<div class="card reflect"><p class="muted small">' + icon('lock') + ' ' + T('ui.blocks.reflectPrivate') + '</p>' +
        prompts.map(function (p, i) {
          var val = (S.journal[lid] || [])[i] || '';
          return '<label class="reflect-q" for="rf-' + i + '"><span>' + (i + 1) + '. ' + esc(p) + '</span></label>' +
            '<textarea id="rf-' + i + '" data-i="' + i + '" rows="3" placeholder="' + T('ui.blocks.reflectPlaceholder') + '">' + esc(val) + '</textarea>';
        }).join('') + '<p class="reflect-status muted small" aria-live="polite"></p></div>',
      bind: function (el, done) {
        var timer;
        function check() {
          var arr = S.journal[lid] || [];
          var filled = arr.filter(function (x) { return x && x.trim().length >= 10; }).length;
          var need = Math.min(2, prompts.length);
          $('.reflect-status', el).textContent = t('ui.blocks.reflectCount', { n: Math.min(filled, need), total: need });
          if (filled >= need) { markActivity(key); done(); }
        }
        $$('textarea', el).forEach(function (ta) {
          ta.addEventListener('input', function () {
            S.journal[lid] = S.journal[lid] || [];
            S.journal[lid][+ta.getAttribute('data-i')] = ta.value;
            clearTimeout(timer); timer = setTimeout(function () { save(); check(); }, 300);
          });
        });
        check();
      }
    };
  };

  BLOCKS.links = function (P, E) {
    return {
      html: '<h2 class="block-title">' + icon('book') + ' ' + esc(P('title') || t('ui.blocks.learnMore')) + '</h2>' +
        '<ul class="link-list">' + E('items').map(function (it, i) {
          return '<li><a href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' + icon('arrowRight') + ' ' + esc(P('items.' + i + '.label')) + '</a></li>';
        }).join('') + '</ul>'
    };
  };

  BLOCKS.sim = function () {
    return { html: '<a class="tryit" href="#/sim">' + icon('flask') + '<div><strong>' + T('ui.reader.tryIt') + '</strong><p>' + T('ui.reader.tryItDesc') + '</p></div>' + icon('arrowRight', 'go') + '</a>' };
  };

  /* link card to the cancer lab */
  BLOCKS.lab = function (P) {
    return { html: '<a class="tryit tryit-rose" href="#/lab/cancer">' + icon('flask') + '<div><strong>' + esc(P('title') || t('ui.labs.cancer.title')) + '</strong><p>' + esc(P('text') || t('ui.labs.cancer.desc')) + '</p></div>' + icon('arrowRight', 'go') + '</a>' };
  };

  BLOCKS.kit = function () {
    return { html: '<h2 class="block-title">' + icon('backpack') + ' ' + T('ui.forum.kitTitle') + '</h2><div class="card kit kit-inline"></div>', bind: function (el) { renderKit($('.kit', el)); } };
  };

  /* Go-bag packing game: limited slots, weight and time; scored with an explanation per item */
  BLOCKS.gobag = function (P, E, key) {
    var G = LH.GOBAG, items = G.items;
    // best possible score: every essential, plus useful 1-slot items in the slots that remain
    var essentials = items.filter(function (it) { return it.t === 'e'; });
    var essSlots = essentials.reduce(function (a, it) { return a + it.s; }, 0);
    var MAX = essentials.length * G.points.e + Math.max(0, G.slots - essSlots) * G.points.u;
    function kg(n) { return fmt(n, n % 1 ? (Math.round(n * 100) % 10 ? 2 : 1) : 0); }
    function name(i) { return P('items.' + i + '.name'); }

    return {
      required: true,
      html:
        '<div class="gobag">' +
          '<div class="gb-head">' +
            '<small class="eyebrow-sm">' + esc(P('eyebrow')) + '</small>' +
            '<h2>' + esc(P('scenario')) + '</h2><p>' + inline(P('intro')) + '</p>' +
            '<div class="chips gb-rules">' +
              '<span class="chip">' + icon('backpack') + ' ' + T('ui.blocks.gobag.slots', { n: G.slots }) + '</span>' +
              '<span class="chip">' + icon('height') + ' ' + T('ui.blocks.gobag.maxKg', { n: G.kg }) + '</span>' +
              '<span class="chip">' + icon('clock') + ' ' + T('ui.blocks.gobag.seconds', { n: G.seconds }) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="gb-grid">' +
            '<div class="gb-bag">' +
              '<div class="gb-bag-head"><h3>' + T('ui.blocks.gobag.yourBag') + '</h3><span class="gb-status"></span></div>' +
              '<div class="gb-meter"><span class="gb-m-slots"></span></div>' +
              '<div class="gb-meter gb-meter-kg"><span class="gb-m-kg"></span></div>' +
              '<div class="gb-packed"></div>' +
              '<button class="btn btn-primary btn-block gb-finish" type="button" disabled>' + icon('mountain') + ' ' + T('ui.blocks.gobag.finish') + '</button>' +
            '</div>' +
            '<div class="gb-shelf">' +
              '<div class="gb-bag-head"><h3>' + T('ui.blocks.gobag.available') + '</h3><span class="gb-time">' + icon('clock') + ' <strong></strong></span></div>' +
              '<div class="gb-items">' + items.map(function (it, i) {
                return '<button class="gb-item" type="button" data-i="' + i + '" aria-pressed="false">' +
                  '<span class="gb-emoji" aria-hidden="true">' + it.e + '</span>' +
                  '<span class="gb-name">' + esc(name(i)) + '</span>' +
                  '<span class="gb-meta">' + T('ui.blocks.gobag.itemMeta', { s: it.s, kg: kg(it.kg) }) + '</span></button>';
              }).join('') + '</div>' +
              '<div class="gb-cover"><p>' + T('ui.blocks.gobag.ready') + '</p><button class="btn btn-sea btn-lg gb-start" type="button">' + icon('play') + ' ' + T('ui.blocks.gobag.start') + '</button></div>' +
            '</div>' +
          '</div>' +
          '<p class="gb-msg" aria-live="polite"></p>' +
          '<div class="gb-result" aria-live="polite"></div>' +
        '</div>',

      bind: function (el, done) {
        var packed = [], left = G.seconds, timer = null, state = 'idle';
        var msg = $('.gb-msg', el);

        function totals() {
          return packed.reduce(function (a, i) { a.s += items[i].s; a.kg += items[i].kg; return a; }, { s: 0, kg: 0 });
        }
        function renderBag() {
          var tt = totals();
          $('.gb-status', el).textContent = t('ui.blocks.gobag.status', { s: tt.s, smax: G.slots, kg: kg(Math.round(tt.kg * 100) / 100), kgmax: G.kg });
          $('.gb-m-slots', el).style.width = (tt.s / G.slots * 100) + '%';
          var k = $('.gb-m-kg', el);
          k.style.width = Math.min(100, tt.kg / G.kg * 100) + '%';
          k.classList.toggle('warn', tt.kg / G.kg > 0.85);
          $('.gb-packed', el).innerHTML = packed.length ? packed.map(function (i) {
            return '<button class="gb-chip" type="button" data-i="' + i + '" title="' + T('ui.blocks.gobag.remove') + '">' +
              '<span aria-hidden="true">' + items[i].e + '</span> ' + esc(name(i)) + ' ' + icon('close') + '</button>';
          }).join('') : '<p class="gb-empty">' + T('ui.blocks.gobag.empty') + '</p>';
          $$('.gb-chip', el).forEach(function (b) { b.addEventListener('click', function () { toggle(+b.getAttribute('data-i')); }); });
          $$('.gb-item', el).forEach(function (b) {
            var on = packed.indexOf(+b.getAttribute('data-i')) !== -1;
            b.classList.toggle('in', on); b.setAttribute('aria-pressed', on);
          });
          $('.gb-finish', el).disabled = state !== 'play' || !packed.length;
        }
        function say(text, bad) { msg.textContent = text; msg.classList.toggle('bad', !!bad); }
        function toggle(i) {
          if (state !== 'play') return;
          var at = packed.indexOf(i);
          if (at !== -1) { packed.splice(at, 1); say(''); renderBag(); return; }
          var tt = totals(), it = items[i];
          var b = $('.gb-item[data-i="' + i + '"]', el);
          if (tt.s + it.s > G.slots) { say(t('ui.blocks.gobag.noSlots'), true); b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400); return; }
          if (tt.kg + it.kg > G.kg + 1e-9) { say(t('ui.blocks.gobag.tooHeavy'), true); b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400); return; }
          packed.push(i); say(''); renderBag();
        }
        function tick() {
          if (!document.body.contains(el)) { clearInterval(timer); return; }
          left--;
          showTime();
          if (left <= 0) finish(true);
        }
        function showTime() {
          var s = $('.gb-time strong', el);
          s.textContent = Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2);
          $('.gb-time', el).classList.toggle('low', left <= 15 && state === 'play');
        }
        function start() {
          packed = []; left = G.seconds; state = 'play';
          el.querySelector('.gobag').classList.add('playing');
          el.querySelector('.gobag').classList.remove('over');
          $('.gb-result', el).innerHTML = ''; say('');
          showTime(); renderBag();
          clearInterval(timer); timer = setInterval(tick, 1000);
        }
        function finish(timeUp) {
          if (state !== 'play') return;
          state = 'over'; clearInterval(timer);
          el.querySelector('.gobag').classList.remove('playing');
          el.querySelector('.gobag').classList.add('over');
          renderBag();

          var pts = packed.reduce(function (a, i) { return a + G.points[items[i].t]; }, 0);
          var pct = Math.max(0, Math.min(100, Math.round(pts / MAX * 100)));
          var stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1;
          var ess = items.map(function (it, i) { return i; }).filter(function (i) { return items[i].t === 'e'; });
          var missing = ess.filter(function (i) { return packed.indexOf(i) === -1; });
          var poor = packed.filter(function (i) { return items[i].t === 'x'; });
          var extras = packed.filter(function (i) { return items[i].t === 'u'; });
          function list(ids, cls) {
            return '<ul class="gb-list ' + cls + '">' + ids.map(function (i) {
              return '<li><span aria-hidden="true">' + items[i].e + '</span><div><strong>' + esc(name(i)) + '</strong><p>' + esc(P('items.' + i + '.why')) + '</p></div></li>';
            }).join('') + '</ul>';
          }
          var level = stars === 3 ? 'great' : stars === 2 ? 'good' : 'poor';
          $('.gb-result', el).innerHTML =
            '<div class="card gb-card gb-' + level + '">' +
              (timeUp ? '<p class="note">' + icon('clock') + ' ' + T('ui.blocks.gobag.timeUp') + '</p>' : '') +
              '<div class="gb-score"><div class="gb-stars" aria-label="' + stars + '/3">' + [1, 2, 3].map(function (n) { return '<span class="' + (n <= stars ? 'on' : '') + '">' + icon('star') + '</span>'; }).join('') + '</div>' +
                '<div><h3>' + T('ui.blocks.gobag.' + level) + '</h3><p>' + T('ui.blocks.gobag.score', { pct: pct }) + ' · ' + T('ui.blocks.gobag.essentials', { n: ess.length - missing.length, total: ess.length }) + '</p></div></div>' +
              (missing.length ? '<h4>' + icon('alert') + ' ' + T('ui.blocks.gobag.missing') + '</h4>' + list(missing, 'miss') : '') +
              (poor.length ? '<h4>' + icon('close') + ' ' + T('ui.blocks.gobag.poorChoices') + '</h4>' + list(poor, 'bad') : '') +
              (extras.length ? '<h4>' + icon('check') + ' ' + T('ui.blocks.gobag.extras') + '</h4>' + list(extras, 'ok') : '') +
              '<div class="row-center"><button class="btn btn-ghost gb-retry" type="button">' + icon('reset') + ' ' + T('ui.blocks.gobag.retry') + '</button></div>' +
            '</div>';
          $('.gb-retry', el).addEventListener('click', start);
          if (stars === 3 && !S.acts[key]) { addXP(LH.XP.activity); toast(icon('sprout') + ' +' + LH.XP.activity + ' XP'); }
          markActivity(key); done();
          $('.gb-result', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        $$('.gb-item', el).forEach(function (b) { b.addEventListener('click', function () { toggle(+b.getAttribute('data-i')); }); });
        $('.gb-start', el).addEventListener('click', start);
        $('.gb-finish', el).addEventListener('click', function () { finish(false); });
        showTime(); renderBag();
      }
    };
  };

  BLOCKS.planlink = function () {
    return { html: '<a class="tryit tryit-moss" href="#/plan">' + icon('map') + '<div><strong>' + T('ui.plan.title') + '</strong><p>' + T('ui.plan.desc') + '</p></div>' + icon('arrowRight', 'go') + '</a>' };
  };

  /* ================= View: Lesson ================= */

  function viewLesson(main, lid) {
    var m = moduleOf(lid || '');
    if (!m || !en('lessons.' + lid)) return redirect('#/');
    if (!isUnlocked(lid)) { toast(icon('lock') + ' ' + T('ui.learn.locked')); return redirect('#/module/' + m.id); }

    var idx = m.lessons.indexOf(lid), mods = topicMods(m.topic), mi = mods.indexOf(m);
    var base = 'lessons.' + lid;
    var blocks = en(base + '.blocks') || [];
    var already = isDone(lid);
    var isLast = idx === m.lessons.length - 1;
    var nextL = m.lessons[idx + 1];

    var rendered = blocks.map(function (b, i) {
      var bp = base + '.blocks.' + i + '.';
      var P = function (sub) { var v = t(bp + sub); return v === bp + sub ? null : v; };
      var E = function (sub) { return en(bp + sub); };
      var r = (BLOCKS[b.type] || BLOCKS.text)(P, E, lid + '.' + i, lid);
      r.i = i; return r;
    });
    var required = rendered.filter(function (r) { return r.required; });
    var doneSet = {};

    main.innerHTML =
      '<section class="wrap reader">' +
        '<a class="back" href="#/module/' + m.id + '">' + icon('arrowLeft') + ' ' + T('modules.' + m.id + '.title') + '</a>' +
        '<header class="step-head" style="--accent:' + m.accent + '"><span class="step-ic">' + icon(LH.LESSON_ICONS[lid]) + '</span><div>' +
          '<small>' + T('ui.course.moduleN', { n: mi + 1 }) + ' · ' + T('ui.reader.stepOf', { n: idx + 1, total: m.lessons.length }) + ' · ' + T('ui.lesson.minutes', { n: en(base + '.minutes') || 5 }) + '</small>' +
          '<h1>' + T(base + '.title') + '</h1>' + (t(base + '.summary') !== base + '.summary' ? '<p class="lead">' + T(base + '.summary') + '</p>' : '') + '</div></header>' +
        (already ? '<p class="note ok">' + icon('check') + ' ' + T('ui.reader.alreadyDone') + '</p>' : '') +
        rendered.map(function (r) { return '<div class="block block-' + blocks[r.i].type + '" data-b="' + r.i + '">' + r.html + '</div>'; }).join('') +
        '<div class="reader-foot">' +
          (required.length ? '<p class="muted small" id="req-status"></p>' : '') +
          '<button class="btn btn-primary btn-lg" type="button" id="complete-btn">' +
            (already ? (isLast ? T('ui.learn.trail') : T('ui.reader.next')) : T('ui.reader.complete')) + ' ' + icon('arrowRight') +
          '</button></div>' +
      '</section>';

    var btn = $('#complete-btn', main);
    function refresh() {
      var n = Object.keys(doneSet).length;
      var ok = already || n >= required.length;
      btn.disabled = !ok;
      var st = $('#req-status', main);
      if (st) st.innerHTML = ok ? icon('check') + ' ' + T('ui.lesson.ready') : T('ui.lesson.activities', { n: n, total: required.length });
    }
    rendered.forEach(function (r) {
      if (r.bind) r.bind($('[data-b="' + r.i + '"]', main), function () { if (!doneSet[r.i]) { doneSet[r.i] = 1; refresh(); } });
    });
    refresh();

    btn.addEventListener('click', function () {
      if (!already) {
        S.done[lid] = Date.now();
        addXP(LH.XP.lesson);
        save();
        toast(icon('sprout') + ' +' + LH.XP.lesson + ' XP');
        checkBadges();
        if (isLast) {
          location.hash = '#/module/' + m.id;
          var nextMod = mods[mi + 1];
          setTimeout(function () {
            celebrate(t('ui.done.moduleTitle'), t('ui.done.moduleBody', { module: t('modules.' + m.id + '.title') }),
              nextMod ? '<a class="btn btn-primary" href="#/module/' + nextMod.id + '" onclick="document.querySelector(\'.modal-close\').click()">' + T('ui.course.nextModule') + '</a>'
                      : '<a class="btn btn-primary" href="#/exam/' + m.topic + '" onclick="document.querySelector(\'.modal-close\').click()">' + icon('trophy') + ' ' + T('ui.exam.title') + '</a>');
          }, 250);
          return;
        }
        justUnlocked = nextL;
        location.hash = '#/module/' + m.id;
        return;
      }
      location.hash = nextL ? '#/lesson/' + nextL : '#/module/' + m.id;
    });
  }

  /* ================= View: Exam (one per topic) ================= */

  function viewExam(main, tid) {
    var tp = topic(tid);
    if (!tp || !tp.available) return redirect('#/');
    var es = examState(tid), key = tp.exam; // content key of the question pool
    var head = '<section class="wrap reader"><a class="back" href="#/topic/' + tid + '">' + icon('arrowLeft') + ' ' + T('topics.' + tid + '.title') + '</a>' +
      '<header class="step-head" style="--accent:' + tp.accent + '"><span class="step-ic">' + icon('trophy') + '</span><div>' +
      '<small>' + T('topics.' + tid + '.title') + '</small><h1>' + T('ui.exam.title') + '</h1><p class="lead">' + T('ui.exam.desc') + '</p></div></header>';

    if (!examUnlocked(tid)) {
      var nx = nextLesson(tid);
      main.innerHTML = head + '<div class="card locked-card">' + icon('lock') + '<p>' + T('ui.exam.lockedMsg', { n: allLessons(tid).length - totalDone(tid) }) + '</p>' +
        '<a class="btn btn-primary" href="' + (nx ? '#/lesson/' + nx : '#/topic/' + tid) + '">' + T('ui.home.continue') + '</a></div>' +
        (es.passed ? certificateHTML(tid) : '') + '</section>';
      bindCert(main);
      return;
    }

    var pool = en(key + '.questions');
    var pick = shuffle(pool.map(function (q, i) { return i; })).slice(0, LH.EXAM.count);
    var answers = {};

    main.innerHTML = head +
      '<div class="card exam-info"><p>' + T('ui.exam.rules', { n: pick.length, pct: Math.round(LH.EXAM.pass * 100) }) + '</p>' +
        (es.best ? '<p class="muted small">' + T('ui.exam.best', { score: es.best, total: LH.EXAM.count }) + '</p>' : '') + '</div>' +
      '<div class="quiz exam-q">' + pick.map(function (qi, k) {
        var q = key + '.questions.' + qi;
        return '<div class="q card" data-k="' + k + '"><small class="q-num">' + T('ui.reader.questionN', { n: k + 1 }) + '</small><h3>' + T(q + '.q') + '</h3>' +
          '<div class="opts">' + t(q + '.o').map(function (o, oi) {
            return '<button class="opt" type="button" data-o="' + oi + '" aria-pressed="false"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span></button>';
          }).join('') + '</div><div class="feedback"></div></div>';
      }).join('') + '</div>' +
      '<div class="reader-foot"><p class="muted small" id="exam-status"></p><button class="btn btn-primary btn-lg" type="button" id="exam-submit" disabled>' + T('ui.exam.submit') + '</button></div>' +
      '<div id="exam-result"></div>' + (es.passed ? certificateHTML(tid) : '') + '</section>';

    var submitted = false;
    function status() {
      var n = Object.keys(answers).length;
      $('#exam-status', main).textContent = t('ui.exam.answered', { n: n, total: pick.length });
      $('#exam-submit', main).disabled = n < pick.length || submitted;
    }
    $$('.exam-q .q', main).forEach(function (qEl) {
      var k = +qEl.getAttribute('data-k');
      $$('.opt', qEl).forEach(function (b) {
        b.addEventListener('click', function () {
          if (submitted) return;
          answers[k] = +b.getAttribute('data-o');
          $$('.opt', qEl).forEach(function (x) { x.classList.toggle('picked', x === b); x.setAttribute('aria-pressed', x === b); });
          status();
        });
      });
    });
    status();

    $('#exam-submit', main).addEventListener('click', function () {
      submitted = true;
      var score = 0;
      $$('.exam-q .q', main).forEach(function (qEl) {
        var k = +qEl.getAttribute('data-k'), qi = pick[k], a = pool[qi].a;
        var right = answers[k] === a;
        if (right) score++;
        $$('.opt', qEl).forEach(function (b) {
          var o = +b.getAttribute('data-o'); b.disabled = true;
          if (o === a) b.classList.add('correct'); else if (o === answers[k]) b.classList.add('wrong');
        });
        var fb = $('.feedback', qEl);
        fb.className = 'feedback ' + (right ? 'ok' : 'bad');
        fb.innerHTML = icon(right ? 'check' : 'close') + '<div><p>' + T(key + '.questions.' + qi + '.e') + '</p></div>';
      });
      var passed = score / pick.length >= LH.EXAM.pass;
      var first = passed && !es.passed;
      es.best = Math.max(es.best, score);
      if (passed) { es.passed = true; if (!es.date) es.date = new Date().toISOString().slice(0, 10); }
      if (first) addXP(LH.XP.exam);
      save(); checkBadges();
      $('#exam-result', main).innerHTML = '<div class="card exam-result ' + (passed ? 'pass' : 'fail') + '">' +
        '<div class="celebrate-ic">' + icon(passed ? 'trophy' : 'sprout') + '</div>' +
        '<h2>' + T(passed ? 'ui.exam.passTitle' : 'ui.exam.failTitle') + '</h2>' +
        '<p class="exam-score">' + score + ' / ' + pick.length + '</p>' +
        '<p>' + T(passed ? 'ui.exam.passBody' : 'ui.exam.failBody', { course: t('topics.' + tid + '.title') }) + '</p>' +
        '<button class="btn btn-ghost" type="button" id="exam-retry">' + icon('reset') + ' ' + T('ui.exam.retry') + '</button></div>' +
        (passed && !$('.certificate', main) ? certificateHTML(tid) : '');
      $('#exam-retry', main).addEventListener('click', function () { route(); });
      bindCert(main);
      $('#exam-result', main).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    bindCert(main);
  }

  function certificateHTML(tid) {
    var es = examState(tid);
    return '<div class="card cert-card"><h2 class="block-title">' + icon('star') + ' ' + T('ui.exam.certTitle') + '</h2>' +
      '<label class="plan-field"><span>' + T('ui.exam.certName') + '</span><input type="text" id="cert-name" maxlength="60" value="' + esc(S.certName) + '"></label>' +
      '<div class="certificate" id="certificate">' +
        '<div class="cert-in"><span class="brand-mark">' + icon('leaf') + '</span>' +
        '<small>LearnHub</small><h2>' + T('ui.exam.certHeading') + '</h2>' +
        '<p>' + T('ui.exam.certPresented') + '</p><p class="cert-name" id="cert-name-out">' + esc(S.certName || '—') + '</p>' +
        '<p>' + T('ui.exam.certBody', { course: t('topics.' + tid + '.title') }) + '</p><p class="muted small">' + esc(es.date) + '</p></div></div>' +
      '<div class="row-center"><button class="btn btn-primary" type="button" id="cert-print">' + icon('print') + ' ' + T('ui.exam.certPrint') + '</button></div></div>';
  }
  function bindCert(main) {
    var inp = $('#cert-name', main);
    if (!inp || inp.dataset.bound) return;
    inp.dataset.bound = 1;
    inp.addEventListener('input', function () { S.certName = inp.value; $('#cert-name-out', main).textContent = inp.value || '—'; save(); });
    $('#cert-print', main).addEventListener('click', function () { printOnly('print-cert'); });
  }
  function printOnly(cls) {
    document.body.classList.add(cls);
    setTimeout(function () { window.print(); document.body.classList.remove(cls); }, 50);
  }

  /* ================= View: DRR Plan builder ================= */

  function viewPlan(main) {
    var p = S.plan = S.plan || {};
    function txt(id, multiline) {
      var v = esc(p[id] || '');
      return '<label class="plan-field"><span>' + T('ui.plan.f.' + id) + '</span>' +
        (multiline ? '<textarea data-f="' + id + '" rows="2">' + v + '</textarea>' : '<input type="text" data-f="' + id + '" value="' + v + '">') +
        (t('ui.plan.h.' + id) !== 'ui.plan.h.' + id ? '<small class="muted">' + T('ui.plan.h.' + id) + '</small>' : '') + '</label>';
    }
    function checks(id, list) {
      var cur = p[id] || [];
      return '<fieldset class="plan-checks"><legend>' + T('ui.plan.f.' + id) + '</legend><div class="chips">' + list.map(function (o) {
        var on = cur.indexOf(o) !== -1;
        return '<label class="chip chip-check' + (on ? ' active' : '') + '"><input type="checkbox" data-c="' + id + '" value="' + o + '"' + (on ? ' checked' : '') + '>' + T('ui.plan.opts.' + o) + '</label>';
      }).join('') + '</div></fieldset>';
    }
    function section(n, iconName, key, body) {
      return '<section class="card plan-sec"><h2 class="block-title"><span class="plan-n">' + n + '</span>' + icon(iconName) + ' ' + T('ui.plan.s.' + key) + '</h2>' + body + '</section>';
    }

    main.innerHTML =
      '<section class="wrap reader plan">' +
        '<header class="step-head" style="--accent:#5f8a3e"><span class="step-ic">' + icon('map') + '</span><div><h1>' + T('ui.plan.title') + '</h1><p class="lead">' + T('ui.plan.intro') + '</p></div></header>' +
        '<p class="note">' + icon('lock') + ' ' + T('ui.plan.privacy') + '</p>' +
        '<div class="progress-line"><div class="bar"><span id="plan-bar"></span></div><strong id="plan-pct"></strong></div>' +
        section(1, 'home', 'household', txt('name') + txt('members') + checks('needs', LH.PLAN.needs) + txt('needsNotes', true)) +
        section(2, 'alert', 'risks', checks('hazards', LH.PLAN.hazards) + txt('riskNotes', true)) +
        section(3, 'radio', 'warning', checks('alerts', LH.PLAN.alerts) + '<p class="muted small">' + T('ui.plan.naturalSigns') + '</p>') +
        section(4, 'mountain', 'evacuation', txt('site1') + txt('site2') + txt('route', true) + txt('walk') + txt('meeting')) +
        section(5, 'users', 'contacts', txt('contact') + txt('local') + txt('neighbours', true)) +
        section(6, 'hand', 'roles', txt('roleBag') + txt('roleHelp') + txt('roleUtilities') + txt('rolePets')) +
        section(7, 'backpack', 'supplies', '<p>' + T('ui.plan.kitStatus', { n: S.kit.length, total: LH.KIT.length }) + ' <a href="#/forum">' + T('ui.plan.kitLink') + '</a></p>' + txt('boxDays') + txt('boxPlace')) +
        section(8, 'calendar', 'practice', txt('drill') + txt('review')) +
        '<div class="reader-foot plan-actions">' +
          '<button class="btn btn-ghost" type="button" id="plan-dl">' + icon('download') + ' ' + T('ui.plan.download') + '</button>' +
          '<button class="btn btn-primary" type="button" id="plan-print">' + icon('print') + ' ' + T('ui.plan.print') + '</button></div>' +
        '<div class="plan-print" id="plan-print-out"></div>' +
      '</section>';

    function progress() {
      var fields = ['name', 'members', 'hazards', 'alerts', 'site1', 'route', 'meeting', 'contact', 'roleBag', 'drill'];
      var n = fields.filter(function (k) { var v = p[k]; return Array.isArray(v) ? v.length : v && String(v).trim(); }).length;
      $('#plan-bar', main).style.width = (n / fields.length * 100) + '%';
      $('#plan-pct', main).textContent = planComplete() ? t('ui.plan.readyShort') : t('ui.plan.required');
      if (planComplete() && !S.planDone) {
        S.planDone = true; addXP(LH.XP.plan); save();
        toast(icon('map') + ' +' + LH.XP.plan + ' XP'); checkBadges();
      }
    }
    var timer;
    $$('[data-f]', main).forEach(function (inp) {
      inp.addEventListener('input', function () {
        p[inp.getAttribute('data-f')] = inp.value;
        clearTimeout(timer); timer = setTimeout(function () { save(); progress(); }, 300);
      });
    });
    $$('[data-c]', main).forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = cb.getAttribute('data-c'), cur = p[id] || [];
        p[id] = cb.checked ? cur.concat(cb.value).filter(function (v, i, a) { return a.indexOf(v) === i; }) : cur.filter(function (v) { return v !== cb.value; });
        cb.parentNode.classList.toggle('active', cb.checked);
        save(); progress();
      });
    });

    function planLines() {
      var out = [];
      function val(k) {
        var v = p[k];
        if (Array.isArray(v)) return v.map(function (o) { return t('ui.plan.opts.' + o); }).join(', ');
        return v || '—';
      }
      var secs = [
        ['household', ['name', 'members', 'needs', 'needsNotes']],
        ['risks', ['hazards', 'riskNotes']],
        ['warning', ['alerts']],
        ['evacuation', ['site1', 'site2', 'route', 'walk', 'meeting']],
        ['contacts', ['contact', 'local', 'neighbours']],
        ['roles', ['roleBag', 'roleHelp', 'roleUtilities', 'rolePets']],
        ['supplies', ['boxDays', 'boxPlace']],
        ['practice', ['drill', 'review']]
      ];
      secs.forEach(function (s, i) {
        out.push({ h: (i + 1) + '. ' + t('ui.plan.s.' + s[0]), rows: s[1].map(function (k) { return [t('ui.plan.f.' + k), val(k)]; }) });
      });
      out[6].rows.unshift([t('ui.forum.kitTitle'), t('ui.forum.kitCount', { n: S.kit.length, total: LH.KIT.length })]);
      return out;
    }

    $('#plan-print', main).addEventListener('click', function () {
      $('#plan-print-out', main).innerHTML = '<h1>' + T('ui.plan.title') + '</h1><p>' + T('ui.plan.naturalSigns') + '</p>' +
        planLines().map(function (s) {
          return '<h2>' + esc(s.h) + '</h2><table>' + s.rows.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>';
        }).join('') + '<p class="small">LearnHub · ' + T('ui.footer.note') + '</p>';
      printOnly('print-plan');
    });
    $('#plan-dl', main).addEventListener('click', function () {
      var text = t('ui.plan.title').toUpperCase() + '\n\n' + planLines().map(function (s) {
        return s.h + '\n' + s.rows.map(function (r) { return '  ' + r[0] + ': ' + r[1]; }).join('\n');
      }).join('\n\n') + '\n\n' + t('ui.plan.naturalSigns') + '\n';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      a.download = 'my-drr-plan.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    progress();
  }

  /* ================= View: Cancer Lab =================
   * Turn-based model of a tumour made of 4 sub-populations (clones). Each week the learner
   * picks one action; cells grow, treatments kill some clones and not others, and
   * resistant clones take over when the same drug is used alone. Numbers are in billions
   * of cells (1 ≈ a 1 cm tumour). Educational, not a medical model. */

  var CLONES = [
    { id: 'sens', color: '#c8643b', chemo: 0.75, target: true, antigen: true, grow: 1.15, start: 10 },
    { id: 'chemoR', color: '#7a4fa0', chemo: 0.08, target: true, antigen: true, grow: 1.13, start: 1e-3 },
    { id: 'targetR', color: '#d2a021', chemo: 0.7, target: false, antigen: true, grow: 1.13, start: 1e-3 },
    { id: 'hidden', color: '#1f6f8b', chemo: 0.7, target: true, antigen: false, grow: 1.13, start: 1e-4 }
  ];
  var LAB = { weeks: 40, cure: 1e-6, fatal: 200, spread: 40, detect: 1 };
  var ACTIONS = [
    { id: 'wait', icon: 'clock' },
    { id: 'surgery', icon: 'hand', once: true, harm: 20 },
    { id: 'radiation', icon: 'sun', harm: 10 },
    { id: 'chemo', icon: 'flask', harm: 15 },
    { id: 'targeted', icon: 'target', harm: 4 },
    { id: 'immuno', icon: 'shield', harm: 5 },
    { id: 'cart', icon: 'cell', once: true, harm: 30 }
  ];

  function cellWord(n) {
    if (n < LAB.cure) return t('ui.labs.cancer.undetectable');
    if (n >= 1) return t('ui.labs.cancer.billion', { n: fmt(n, n < 10 ? 1 : 0) });
    if (n >= 1e-3) return t('ui.labs.cancer.million', { n: fmt(n * 1e3, n < 1e-2 ? 1 : 0) });
    return t('ui.labs.cancer.thousand', { n: fmt(Math.max(1, n * 1e6), 0) });
  }

  function viewCancerLab(main) {
    var L = 'ui.labs.cancer.';
    var st;

    main.innerHTML =
      '<section class="wrap page-head">' +
        '<a class="back" href="#/topic/cancer">' + icon('arrowLeft') + ' ' + T('topics.cancer.title') + '</a>' +
        '<div class="page-title" style="--accent:#b04a6a"><span class="topic-ic">' + icon('cell') + '</span>' +
          '<div><h1>' + T(L + 'title') + '</h1><p class="muted">' + T(L + 'intro') + '</p></div></div>' +
        '<p class="note">' + icon('heart') + ' ' + T('ui.health.disclaimer') + '</p>' +
      '</section>' +
      '<section class="wrap lab-grid">' +
        '<div class="card lab-panel">' +
          '<div class="lab-stats">' +
            '<div><small>' + T(L + 'week') + '</small><strong id="lab-week"></strong></div>' +
            '<div><small>' + T(L + 'burden') + '</small><strong id="lab-burden"></strong></div>' +
            '<div><small>' + T(L + 'spread') + '</small><strong id="lab-spread"></strong></div>' +
          '</div>' +
          '<div class="lab-health"><small>' + T(L + 'health') + '</small><div class="bar"><span id="lab-hbar"></span></div><strong id="lab-hval"></strong></div>' +
          '<div class="lab-field" id="lab-field" aria-hidden="true"></div>' +
          '<ul class="lab-legend">' + CLONES.map(function (c) {
            return '<li><span style="background:' + c.color + '"></span>' + T(L + 'clones.' + c.id) + ' <em data-share="' + c.id + '"></em></li>';
          }).join('') + '</ul>' +
        '</div>' +
        '<div class="card lab-panel">' +
          '<h2 class="block-title">' + icon('hand') + ' ' + T(L + 'choose') + '</h2>' +
          '<div class="lab-actions">' + ACTIONS.map(function (a) {
            return '<button class="lab-act" type="button" data-act="' + a.id + '">' + icon(a.icon) +
              '<span><strong>' + T(L + 'actions.' + a.id + '.name') + '</strong><small>' + T(L + 'actions.' + a.id + '.desc') + '</small></span>' +
              (a.harm ? '<em class="harm">−' + a.harm + '</em>' : '') + '</button>';
          }).join('') + '</div>' +
          '<div class="lab-log" id="lab-log" aria-live="polite"></div>' +
        '</div>' +
      '</section>' +
      '<section class="wrap"><div class="card"><h2 class="block-title">' + icon('gauge') + ' ' + T(L + 'chart') + '</h2>' +
        '<div id="lab-chart" class="lab-chart"></div><p class="muted small">' + T(L + 'chartNote') + '</p></div>' +
        '<div id="lab-result"></div>' +
        '<div class="card lab-tips"><h2 class="block-title">' + icon('leaf') + ' ' + T(L + 'tipsTitle') + '</h2>' +
          rich(t(L + 'tips').map(function (x) { return '- ' + x; })) + '</div>' +
      '</section>';

    function reset() {
      st = {
        week: 0, health: 100, spread: false, over: false, used: {}, immuno: 0, cart: 0,
        n: CLONES.map(function (c) { return c.start; }),
        hist: []
      };
      st.hist.push(st.n.slice());
      $('#lab-log', main).innerHTML = '<p>' + T(L + 'start') + '</p>';
      $('#lab-result', main).innerHTML = '';
      render();
    }
    function total() { return st.n.reduce(function (a, b) { return a + b; }, 0); }
    function log(msg, kind) {
      var box = $('#lab-log', main);
      box.insertAdjacentHTML('afterbegin', '<p class="' + (kind || '') + '"><strong>' + T(L + 'weekN', { n: st.week }) + '</strong> ' + esc(msg) + '</p>');
    }

    function act(id) {
      if (st.over) return;
      var a = ACTIONS.filter(function (x) { return x.id === id; })[0];
      if (a.once && st.used[id]) { log(t(L + 'onceOnly'), 'bad'); return; }
      if (a.harm && st.health - a.harm <= 0) { log(t(L + 'tooWeak'), 'bad'); return; }
      st.week++;
      var before = total(), msg;
      var kill = function (fn) { st.n = st.n.map(function (v, i) { return v * (1 - fn(CLONES[i])); }); };

      if (id === 'surgery') {
        kill(function () { return st.spread ? 0.6 : 0.999; });
        msg = t(L + (st.spread ? 'msg.surgerySpread' : 'msg.surgery'));
      } else if (id === 'radiation') {
        kill(function () { return st.spread ? 0.45 : 0.85; });
        msg = t(L + (st.spread ? 'msg.radiationSpread' : 'msg.radiation'));
      } else if (id === 'chemo') {
        kill(function (c) { return c.chemo; });
        msg = t(L + 'msg.chemo');
      } else if (id === 'targeted') {
        kill(function (c) { return c.target ? 0.95 : 0; });
        msg = t(L + 'msg.targeted');
      } else if (id === 'immuno') {
        st.immuno = 3;
        msg = t(L + 'msg.immuno');
      } else if (id === 'cart') {
        kill(function (c) { return c.antigen ? 0.999 : 0; });
        st.cart = 2;
        msg = t(L + 'msg.cart');
      } else {
        msg = t(L + 'msg.wait');
      }
      if (a.once) st.used[id] = true;

      // lingering effects of immune therapies
      if (st.immuno > 0) { kill(function () { return 0.4; }); st.immuno--; }
      if (st.cart > 0 && id !== 'cart') { kill(function (c) { return c.antigen ? 0.9 : 0; }); st.cart--; }

      // one week of growth
      st.n = st.n.map(function (v, i) { return v * CLONES[i].grow; });
      st.health = Math.max(0, Math.min(100, st.health - (a.harm || 0) + 5));
      if (!st.spread && total() > LAB.spread) { st.spread = true; log(t(L + 'msg.spreadNow'), 'bad'); }

      var after = total();
      log(msg + ' ' + t(after < before ? L + 'msg.shrank' : L + 'msg.grew', { from: cellWord(before), to: cellWord(after) }));
      var resist = resistantShare();
      if (resist > 0.5 && after > 1e-3) log(t(L + 'msg.resistance', { pct: Math.round(resist * 100) }), 'bad');

      st.hist.push(st.n.slice());
      S.lab.runs++; save();
      check();
      render();
    }

    function resistantShare() {
      var tt = total();
      return tt ? (tt - st.n[0]) / tt : 0;
    }

    function check() {
      var tt = total(), res = null;
      if (tt < LAB.cure) res = 'win';
      else if (tt >= LAB.fatal) res = 'spread';
      else if (st.week >= LAB.weeks) res = 'time';
      if (!res) return;
      st.over = true;
      if (res === 'win' && !S.lab.remission) { S.lab.remission = true; addXP(LH.XP.activity * 3); save(); checkBadges(); }
      $('#lab-result', main).innerHTML = '<div class="card lab-result lab-' + res + '">' +
        '<div class="celebrate-ic">' + icon(res === 'win' ? 'trophy' : 'alert') + '</div>' +
        '<h2>' + T(L + 'result.' + res + '.title') + '</h2><p>' + T(L + 'result.' + res + '.body', { weeks: st.week }) + '</p>' +
        '<button class="btn btn-primary" type="button" id="lab-again">' + icon('reset') + ' ' + T(L + 'again') + '</button></div>';
      $('#lab-again', main).addEventListener('click', reset);
      $('#lab-result', main).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function render() {
      var tt = total();
      $('#lab-week', main).textContent = st.week + ' / ' + LAB.weeks;
      $('#lab-burden', main).textContent = cellWord(tt);
      $('#lab-spread', main).textContent = t(L + (st.spread ? 'spreadYes' : 'spreadNo'));
      $('#lab-spread', main).className = st.spread ? 'bad' : '';
      $('#lab-hbar', main).style.width = st.health + '%';
      $('#lab-hbar', main).className = st.health < 35 ? 'low' : '';
      $('#lab-hval', main).textContent = st.health + ' / 100';
      CLONES.forEach(function (c, i) {
        $('[data-share="' + c.id + '"]', main).textContent = tt ? Math.round(st.n[i] / tt * 100) + '%' : '0%';
      });
      $$('.lab-act', main).forEach(function (b) {
        var a = ACTIONS.filter(function (x) { return x.id === b.getAttribute('data-act'); })[0];
        b.disabled = st.over || (a.once && st.used[a.id]);
      });
      drawField(tt);
      drawChart();
    }

    /* tissue view: healthy cells (green) and cancer cells coloured by clone; dot count ~ log(size) */
    function drawField(tt) {
      var W = 320, H = 190, max = 150;
      var k = tt < LAB.cure ? 0 : Math.max(1, Math.round(Math.log10(tt / LAB.cure) / Math.log10(LAB.fatal / LAB.cure) * max));
      var dots = [], rng = mulberry(7);
      var shares = st.n.map(function (v) { return tt ? v / tt : 0; });
      var counts = shares.map(function (s) { return s > 0.005 ? Math.max(1, Math.round(s * k)) : 0; });
      var healthy = '';
      for (var h = 0; h < 90; h++) {
        healthy += '<circle cx="' + (rng() * W).toFixed(1) + '" cy="' + (rng() * H).toFixed(1) + '" r="5" fill="#9ccb72" opacity="' + (0.25 + st.health / 250).toFixed(2) + '"/>';
      }
      var rng2 = mulberry(3);
      counts.forEach(function (c, i) {
        for (var j = 0; j < c; j++) {
          // cancer cells cluster around the tumour centre; once spread, some appear far away
          var far = st.spread && rng2() < 0.25;
          var ang = rng2() * Math.PI * 2, rad = (far ? 60 + rng2() * 90 : Math.sqrt(rng2()) * (18 + k * 0.5));
          var cx = (far ? W * (rng2() < 0.5 ? 0.15 : 0.85) : W / 2) + Math.cos(ang) * rad * (far ? 0.3 : 1);
          var cy = H / 2 + Math.sin(ang) * rad * (far ? 0.3 : 0.7);
          dots.push('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.2" fill="' + CLONES[i].color + '" stroke="#fff" stroke-width=".8"/>');
        }
      });
      $('#lab-field', main).innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '"><rect width="' + W + '" height="' + H + '" rx="14" fill="#fbeef0"/>' + healthy + dots.join('') + '</svg>';
    }

    /* log-scale chart of each clone over time */
    function drawChart() {
      var W = 640, H = 240, pl = 44, pr = 10, pt = 10, pb = 26;
      var ymin = -7, ymax = Math.log10(LAB.fatal * 3);
      function x(w) { return pl + (w / LAB.weeks) * (W - pl - pr); }
      function y(v) { var lv = Math.max(ymin, Math.log10(Math.max(v, 1e-9))); return pt + (1 - (lv - ymin) / (ymax - ymin)) * (H - pt - pb); }
      var grid = '';
      [[LAB.fatal, 'fatal', '#c8643b'], [LAB.detect, 'detect', '#8a8574'], [LAB.cure, 'cure', '#5f8a3e']].forEach(function (g) {
        grid += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(g[0]) + '" y2="' + y(g[0]) + '" stroke="' + g[2] + '" stroke-dasharray="4 4"/>' +
          '<text x="' + (pl + 4) + '" y="' + (y(g[0]) - 4) + '" fill="' + g[2] + '" font-size="11" font-weight="700">' + T(L + 'line.' + g[1]) + '</text>';
      });
      for (var w = 0; w <= LAB.weeks; w += 10) grid += '<text x="' + x(w) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" fill="#5e6e5f">' + w + '</text>';
      var lines = CLONES.map(function (c, i) {
        var pts = st.hist.map(function (n, wk) { return x(wk).toFixed(1) + ',' + y(n[i]).toFixed(1); }).join(' ');
        return '<polyline points="' + pts + '" fill="none" stroke="' + c.color + '" stroke-width="2.5" stroke-linejoin="round"/>';
      }).join('');
      var totPts = st.hist.map(function (n, wk) { return x(wk).toFixed(1) + ',' + y(n.reduce(function (a, b) { return a + b; }, 0)).toFixed(1); }).join(' ');
      $('#lab-chart', main).innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + T(L + 'chart') + '">' +
        '<rect x="' + pl + '" y="' + pt + '" width="' + (W - pl - pr) + '" height="' + (H - pt - pb) + '" fill="#fffdf7" stroke="#e4dcc6"/>' + grid + lines +
        '<polyline points="' + totPts + '" fill="none" stroke="#233326" stroke-width="1.5" stroke-dasharray="2 3"/>' +
        '<text x="' + (W - pr) + '" y="' + (H - 8) + '" font-size="11" text-anchor="end" fill="#5e6e5f">' + T(L + 'weeks') + '</text></svg>';
    }

    function mulberry(a) {
      return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var r = Math.imul(a ^ a >>> 15, 1 | a); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; };
    }

    $$('.lab-act', main).forEach(function (b) { b.addEventListener('click', function () { act(b.getAttribute('data-act')); }); });
    reset();
  }

  /* ================= View: Simulator ================= */

  var DIST_MIN = 20, DIST_MAX = 8000;
  function distFromSlider(v) {
    var d = DIST_MIN * Math.pow(DIST_MAX / DIST_MIN, v / 1000);
    return d < 100 ? Math.round(d / 5) * 5 : d < 1000 ? Math.round(d / 10) * 10 : Math.round(d / 50) * 50;
  }
  function sliderFromDist(d) { return Math.round((1000 * Math.log(d / DIST_MIN)) / Math.log(DIST_MAX / DIST_MIN)); }

  function duration(sec) {
    var mins = Math.max(1, Math.round(sec / 60));
    if (mins < 60) return t('ui.sim.durMin', { m: mins });
    return t('ui.sim.durHM', { h: Math.floor(mins / 60), m: mins % 60 });
  }

  function viewSim(main) {
    var p = Object.assign({ m: 8.5, dist: 800, depth: 3000 }, S.simLast || {});

    main.innerHTML =
      '<section class="wrap page-head">' +
        '<div class="page-title" style="--accent:#1f6f8b"><span class="topic-ic">' + icon('flask') + '</span>' +
        '<div><h1>' + T('ui.sim.title') + '</h1><p class="muted">' + T('ui.sim.intro') + '</p></div></div>' +
      '</section>' +
      '<section class="wrap sim-grid">' +
        '<div class="card sim-controls">' +
          '<div class="field"><label for="sl-m">' + icon('quake') + ' ' + T('ui.sim.magnitude') + '</label><output id="out-m"></output>' +
            '<input type="range" id="sl-m" min="6" max="9.5" step="0.1"></div>' +
          '<div class="field"><label for="sl-d">' + icon('compass') + ' ' + T('ui.sim.distance') + '</label><output id="out-d"></output>' +
            '<input type="range" id="sl-d" min="0" max="1000" step="1"></div>' +
          '<div class="field"><label for="sl-z">' + icon('anchor') + ' ' + T('ui.sim.depth') + '</label><output id="out-z"></output>' +
            '<input type="range" id="sl-z" min="50" max="8000" step="50"></div>' +
          '<div class="presets"><small class="muted">' + T('ui.sim.presetsTitle') + '</small><div class="chips">' +
            LH.SIM_PRESETS.map(function (pr) { return '<button class="chip" type="button" data-preset="' + pr.id + '">' + T('ui.sim.presets.' + pr.id) + '</button>'; }).join('') +
          '</div></div>' +
          '<button class="btn btn-sea btn-lg btn-block" type="button" id="launch">' + icon('play') + ' ' + T('ui.sim.launch') + '</button>' +
        '</div>' +
        '<div class="card sim-stage-card">' +
          '<div class="sim-clock"><span>' + icon('clock') + ' ' + T('ui.sim.elapsed') + '</span><strong id="sim-clock">—</strong></div>' +
          '<div id="sim-stage" class="sim-stage"></div>' +
          '<p class="sim-status" id="sim-status" aria-live="polite"></p>' +
        '</div>' +
      '</section>' +
      '<section class="wrap stats">' +
        '<div class="stat"><span class="stat-ic">' + icon('gauge') + '</span><small>' + T('ui.sim.speed') + '</small><strong id="r-speed"></strong><em id="r-speed2"></em></div>' +
        '<div class="stat"><span class="stat-ic">' + icon('clock') + '</span><small>' + T('ui.sim.arrival') + '</small><strong id="r-time"></strong></div>' +
        '<div class="stat"><span class="stat-ic">' + icon('height') + '</span><small>' + T('ui.sim.height') + '</small><strong id="r-height"></strong></div>' +
        '<div class="stat stat-danger" id="r-level-card"><span class="stat-ic">' + icon('alert') + '</span><small>' + T('ui.sim.danger') + '</small><strong id="r-level"></strong></div>' +
      '</section>' +
      '<section class="wrap"><p class="note" id="r-unlikely" hidden>' + icon('alert') + ' ' + T('ui.sim.unlikely') + '</p></section>' +
      '<section class="wrap sim-lower">' +
        '<div class="card"><h2 class="section-title">' + icon('gauge') + ' ' + T('ui.sim.compare') + '</h2><div id="compare" class="compare"></div></div>' +
        '<div class="card"><h2 class="section-title">' + icon('leaf') + ' ' + T('ui.sim.formulaTitle') + '</h2>' +
          '<ul class="leaf-list">' + t('ui.sim.formula').map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
          '<p class="muted small">' + T('ui.sim.disclaimer') + '</p></div>' +
      '</section>';

    var slM = $('#sl-m', main), slD = $('#sl-d', main), slZ = $('#sl-z', main);
    var res = null;

    var stage = LH.Sim.mount($('#sim-stage', main), {
      aria: T('ui.sim.title'),
      epicenter: T('ui.sim.epicenter'),
      coast: T('ui.sim.coast'),
      notToScale: T('ui.sim.notToScale'),
      fmtDepth: function (v) { return fmt(v) + ' m'; },
      fmtDist: function (v) { return '← ' + fmt(v) + ' km →'; }
    }, function (sec, state) {
      var clock = $('#sim-clock', main), status = $('#sim-status', main);
      if (!clock) return;
      if (state === 'idle') { clock.textContent = '—'; status.textContent = ''; return; }
      clock.textContent = duration(sec);
      status.textContent = state === 'done' || state === 'runup' ? t('ui.sim.arrived') : '';
    });

    function setSliders() { slM.value = p.m; slD.value = sliderFromDist(p.dist); slZ.value = p.depth; }
    function update() {
      res = LH.Sim.compute(p);
      $('#out-m', main).textContent = 'M ' + fmt(p.m, 1);
      $('#out-d', main).textContent = fmt(p.dist) + ' km';
      $('#out-z', main).textContent = fmt(p.depth) + ' m';
      $('#r-speed', main).textContent = fmt(res.kmh) + ' ' + t('ui.sim.kmh');
      $('#r-speed2', main).textContent = fmt(res.v) + ' m/s';
      $('#r-time', main).textContent = duration(res.tSec);
      $('#r-height', main).textContent = res.level === 'none' ? '< 0.5 m' : '~ ' + fmt(res.hs, res.hs < 10 ? 1 : 0) + ' m';
      $('#r-level', main).textContent = t('ui.sim.levels.' + res.level);
      $('#r-level-card', main).setAttribute('data-level', res.level);
      $('#r-unlikely', main).hidden = res.level !== 'none';

      var items = LH.SPEEDS.concat([{ id: 'tsunami', kmh: res.kmh }]);
      var max = Math.max.apply(null, items.map(function (i) { return i.kmh; }));
      $('#compare', main).innerHTML = items.map(function (i) {
        return '<div class="cmp' + (i.id === 'tsunami' ? ' cmp-hl' : '') + '"><span class="cmp-label">' + T('ui.sim.items.' + i.id) + '</span>' +
          '<div class="cmp-track"><span style="width:' + Math.max(2, (i.kmh / max) * 100).toFixed(1) + '%"></span></div>' +
          '<span class="cmp-val">' + fmt(i.kmh) + '</span></div>';
      }).join('');

      stage.setParams(p, res);
      S.simLast = { m: p.m, dist: p.dist, depth: p.depth };
      save();
    }

    slM.addEventListener('input', function () { p.m = +slM.value; update(); });
    slD.addEventListener('input', function () { p.dist = distFromSlider(+slD.value); update(); });
    slZ.addEventListener('input', function () { p.depth = +slZ.value; update(); });
    $$('[data-preset]', main).forEach(function (b) {
      b.addEventListener('click', function () {
        var pr = LH.SIM_PRESETS.filter(function (x) { return x.id === b.getAttribute('data-preset'); })[0];
        p = { m: pr.m, dist: pr.dist, depth: pr.depth };
        setSliders(); update();
      });
    });
    $('#launch', main).addEventListener('click', function () {
      stage.launch();
      S.sim.runs++;
      S.sim.maxDepth = Math.max(S.sim.maxDepth, p.depth);
      save(); checkBadges();
    });

    setSliders(); update();
    cleanup = function () { stage.destroy(); };
  }

  /* ================= Go-bag checklist (forum + Go Bags lesson) ================= */

  function renderKit(box) {
    var n = S.kit.length, total = LH.KIT.length;
    box.innerHTML =
      (box.classList.contains('kit-inline') ? '' : '<h2 class="section-title">' + icon('backpack') + ' ' + T('ui.forum.kitTitle') + '</h2>') +
      '<p class="muted small">' + T('ui.forum.kitIntro') + '</p>' +
      '<div class="progress-line"><div class="bar"><span style="width:' + (n / total * 100) + '%"></span></div><strong>' + T('ui.forum.kitCount', { n: n, total: total }) + '</strong></div>' +
      (n === total ? '<p class="note ok">' + icon('check') + ' ' + T('ui.forum.kitDone') + '</p>' : '') +
      '<ul class="kit-list">' + LH.KIT.map(function (k) {
        var on = S.kit.indexOf(k) !== -1;
        return '<li><label class="check' + (on ? ' on' : '') + '"><input type="checkbox" data-kit="' + k + '"' + (on ? ' checked' : '') + '>' +
          '<span class="box">' + icon('check') + '</span><span>' + T('kit.' + k) + '</span></label></li>';
      }).join('') + '</ul>';
    $$('[data-kit]', box).forEach(function (cb) {
      cb.addEventListener('change', function () {
        var k = cb.getAttribute('data-kit');
        if (cb.checked) { if (S.kit.indexOf(k) === -1) S.kit.push(k); }
        else S.kit = S.kit.filter(function (x) { return x !== k; });
        save(); renderKit(box); checkBadges();
        var again = $('[data-kit="' + k + '"]', box); if (again) again.focus();
      });
    });
  }

  /* ================= View: Survival Forum ================= */

  function viewForum(main) {
    var cat = 'all', query = '';

    main.innerHTML =
      '<section class="wrap page-head">' +
        '<div class="page-title" style="--accent:#5f8a3e"><span class="topic-ic">' + icon('chat') + '</span>' +
        '<div><h1>' + T('ui.forum.title') + '</h1><p class="muted">' + T('ui.forum.intro') + '</p></div></div>' +
      '</section>' +
      '<section class="wrap forum-grid">' +
        '<div>' +
          '<div class="forum-tools">' +
            '<div class="chips" id="cat-chips">' +
              '<button class="chip active" type="button" data-cat="all" aria-pressed="true">' + T('ui.forum.all') + '</button>' +
              LH.FORUM_CATS.map(function (c) { return '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="false">' + icon(c.icon) + ' ' + T('ui.forum.cats.' + c.id) + '</button>'; }).join('') +
            '</div>' +
            '<label class="search">' + icon('search') + '<span class="sr-only">' + T('ui.forum.search') + '</span><input type="search" id="forum-q" placeholder="' + T('ui.forum.search') + '"></label>' +
          '</div>' +
          '<div id="threads" class="threads"></div>' +
        '</div>' +
        '<aside class="card kit" id="kit"></aside>' +
      '</section>';

    function catIcon(id) { return LH.FORUM_CATS.filter(function (c) { return c.id === id; })[0].icon; }

    function renderThreads() {
      var q = query.trim().toLowerCase();
      var list = LH.FORUM.filter(function (th) {
        if (cat !== 'all' && th.cat !== cat) return false;
        if (!q) return true;
        return (t('forum.' + th.id + '.q') + ' ' + t('forum.' + th.id + '.a')).toLowerCase().indexOf(q) !== -1;
      });
      var box = $('#threads', main);
      if (!list.length) { box.innerHTML = '<p class="empty">' + icon('search') + ' ' + T('ui.forum.noResults') + '</p>'; return; }
      box.innerHTML = list.map(function (th) {
        var read = S.forumRead.indexOf(th.id) !== -1;
        return '<details class="thread cat-' + th.cat + '" data-id="' + th.id + '">' +
          '<summary><span class="cat-ic">' + icon(catIcon(th.cat)) + '</span>' +
            '<span class="thread-q"><small>' + T('ui.forum.cats.' + th.cat) + (read ? ' · <span class="read">' + icon('check') + ' ' + T('ui.forum.read') + '</span>' : '') + '</small>' +
            '<strong>' + T('forum.' + th.id + '.q') + '</strong></span>' +
            '<span class="chev">' + icon('chevron') + '</span></summary>' +
          '<div class="thread-a"><span class="guide-av">' + icon('leaf') + '</span><div><strong>' + T('ui.forum.guide') + '</strong><p>' + T('forum.' + th.id + '.a') + '</p></div></div>' +
        '</details>';
      }).join('');
      $$('details', box).forEach(function (d) {
        d.addEventListener('toggle', function () {
          var id = d.getAttribute('data-id');
          if (d.open && S.forumRead.indexOf(id) === -1) { S.forumRead.push(id); save(); checkBadges(); }
        });
      });
    }

    $$('[data-cat]', main).forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.getAttribute('data-cat');
        $$('[data-cat]', main).forEach(function (x) {
          var on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on);
        });
        renderThreads();
      });
    });
    $('#forum-q', main).addEventListener('input', function (e) { query = e.target.value; renderThreads(); });

    renderThreads();
    renderKit($('#kit', main));
  }

  /* ================= Boot ================= */

  setLang(S.lang || detectLang(), false).then(checkBadges);
})();
