/* LearnHub — single-page app shell, router, state, course engine and views */
(function () {
  'use strict';

  var LH = window.LH;
  var icon = LH.icon;
  var STORE_KEY = 'learnhub.v2';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ================= State (localStorage) ================= */

  function defaults() {
    return {
      lang: null, langSwitched: false, xp: 0,
      done: {}, answered: {}, firstTry: 0, acts: {}, journal: {},
      badges: {}, sim: { runs: 0, maxDepth: 0 }, simLast: null,
      forumRead: [], kit: [],
      exam: { best: 0, passed: false, name: '', date: '' },
      plan: {}, planDone: false
    };
  }
  var S = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = defaults(), s = Object.assign(d, JSON.parse(raw));
        s.sim = Object.assign({ runs: 0, maxDepth: 0 }, s.sim);
        s.exam = Object.assign(defaults().exam, s.exam);
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
    return addScript('assets/js/i18n/' + code + '.js')
      .then(function () { return addScript('assets/js/content/' + code + '.js'); })
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

  function moduleOf(lid) { return LH.MODULES.filter(function (m) { return m.lessons.indexOf(lid) !== -1; })[0]; }
  function mod(id) { return LH.MODULES.filter(function (m) { return m.id === id; })[0]; }
  function isDone(lid) { return !!S.done[lid]; }
  function isUnlocked(lid) {
    var m = moduleOf(lid), i = m.lessons.indexOf(lid);
    return i === 0 || isDone(lid) || isDone(m.lessons[i - 1]);
  }
  function modDone(m) { return m.lessons.filter(isDone).length; }
  function allLessons() { return LH.MODULES.reduce(function (a, m) { return a.concat(m.lessons); }, []); }
  function totalDone() { return allLessons().filter(isDone).length; }
  function nextLesson() { return allLessons().filter(function (l) { return !isDone(l) && isUnlocked(l); })[0] || null; }
  function examUnlocked() { return totalDone() === allLessons().length; }
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
    module_m1: function () { return modDone(mod('m1')) === mod('m1').lessons.length; },
    module_m2: function () { return modDone(mod('m2')) === mod('m2').lessons.length; },
    module_m3: function () { return modDone(mod('m3')) === mod('m3').lessons.length; },
    module_m4: function () { return modDone(mod('m4')) === mod('m4').lessons.length; },
    reflective: function () { return LH.MODULES.every(function (m) { return isDone(m.id + 'r'); }); },
    sharp_eye: function () { return S.firstTry >= 10; },
    wave_scientist: function () { return S.sim.runs >= 1; },
    deep_diver: function () { return S.sim.maxDepth >= 6000; },
    wise_owl: function () { return S.forumRead.length >= 5; },
    ready_pack: function () { return S.kit.length >= LH.KIT.length; },
    plan_maker: function () { return planComplete(); },
    exam_pass: function () { return !!S.exam.passed; },
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
    { id: 'course', href: '#/course', icon: 'signpost' },
    { id: 'sim', href: '#/sim', icon: 'flask' },
    { id: 'forum', href: '#/forum', icon: 'chat' },
    { id: 'plan', href: '#/plan', icon: 'map' }
  ];
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
    var navView = { module: 'course', lesson: 'course', exam: 'course' }[currentView] || currentView;
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
    switch (view) {
      case 'course': viewCourse(main); break;
      case 'module': viewModule(main, parts[1]); break;
      case 'lesson': viewLesson(main, parts[1]); break;
      case 'exam': viewExam(main); break;
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

  function moduleCard(m, i) {
    var d = modDone(m), total = m.lessons.length;
    return '<a class="topic-card module-card" href="#/module/' + m.id + '" style="--accent:' + m.accent + '">' +
      '<div class="topic-top"><span class="topic-ic">' + icon(m.icon) + '</span>' + ring(d / total, m.accent) + '</div>' +
      '<small class="eyebrow-sm">' + T('ui.course.moduleN', { n: i + 1 }) + '</small>' +
      '<h3>' + T('modules.' + m.id + '.title') + '</h3><p>' + T('modules.' + m.id + '.desc') + '</p>' +
      '<span class="topic-meta">' + icon('signpost') + ' ' + T('ui.course.lessonsDone', { done: d, total: total }) + '</span></a>';
  }

  function finalCards() {
    var ex = examUnlocked();
    return '<a class="topic-card final-card" href="#/exam" style="--accent:#6b4a2f">' +
        '<div class="topic-top"><span class="topic-ic">' + icon('trophy') + '</span>' +
        (S.exam.passed ? '<span class="pill pill-ok">' + icon('check') + ' ' + T('ui.exam.passedShort') + '</span>' : ex ? '' : '<span class="pill">' + icon('lock') + ' ' + T('ui.course.locked') + '</span>') + '</div>' +
        '<h3>' + T('ui.exam.title') + '</h3><p>' + T('ui.exam.desc') + '</p></a>' +
      '<a class="topic-card final-card" href="#/plan" style="--accent:#5f8a3e">' +
        '<div class="topic-top"><span class="topic-ic">' + icon('map') + '</span>' +
        (planComplete() ? '<span class="pill pill-ok">' + icon('check') + ' ' + T('ui.plan.readyShort') + '</span>' : '') + '</div>' +
        '<h3>' + T('ui.plan.title') + '</h3><p>' + T('ui.plan.desc') + '</p></a>';
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

  function viewHome(main) {
    var L = levelInfo(S.xp);
    var nxt = nextLesson();
    var cta, href;
    if (!totalDone()) { cta = T('ui.home.start'); href = '#/lesson/' + allLessons()[0]; }
    else if (nxt) { cta = T('ui.home.continue'); href = '#/lesson/' + nxt; }
    else { cta = T('ui.home.review'); href = '#/course'; }

    main.innerHTML =
      '<section class="wrap hero">' +
        '<div class="hero-text">' +
          '<span class="eyebrow">' + icon('leaf') + ' ' + T('ui.tagline') + '</span>' +
          '<h1>' + T('ui.home.hello') + '</h1>' +
          '<p class="lead">' + T('ui.home.intro') + '</p>' +
          '<div class="btn-row"><a class="btn btn-primary" href="' + href + '">' + icon('sprout') + ' ' + cta + '</a>' +
          '<a class="btn btn-ghost" href="#/course">' + icon('signpost') + ' ' + T('ui.home.seeCourse') + '</a></div>' +
          (nxt && totalDone() ? '<p class="muted small next-up">' + icon('arrowRight') + ' ' + T('ui.home.nextUp') + ': <strong>' + esc(lessonTitle(nxt)) + '</strong></p>' : '') +
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

      '<section class="wrap"><h2 class="section-title">' + icon('compass') + ' ' + T('ui.home.courseTitle') + '</h2>' +
        '<div class="topic-grid">' + LH.MODULES.map(moduleCard).join('') + finalCards() + '</div></section>' +

      '<section class="wrap feature-row">' +
        '<a class="feature feature-sea" href="#/sim"><span class="feature-ic">' + icon('flask') + '</span><div><h3>' + T('ui.home.simTitle') + '</h3><p>' + T('ui.home.simDesc') + '</p></div>' + icon('arrowRight', 'go') + '</a>' +
        '<a class="feature feature-moss" href="#/forum"><span class="feature-ic">' + icon('chat') + '</span><div><h3>' + T('ui.home.forumTitle') + '</h3><p>' + T('ui.home.forumDesc') + '</p></div>' + icon('arrowRight', 'go') + '</a>' +
      '</section>' +

      '<section class="wrap"><h2 class="section-title">' + icon('leaf') + ' ' + T('ui.home.hazardsTitle') + '</h2>' +
        '<p class="muted">' + T('ui.home.hazardsIntro') + '</p>' +
        '<div class="hazard-row">' + LH.HAZARDS.map(function (h) {
          return '<div class="hazard' + (h.course ? ' on' : '') + '" style="--accent:' + h.accent + '"><span class="topic-ic">' + icon(h.icon) + '</span>' +
            '<strong>' + T('topics.' + h.id + '.title') + '</strong><small>' + (h.course ? T('ui.home.inCourse') : T('ui.home.comingSoon')) + '</small></div>';
        }).join('') + '</div></section>';
  }

  /* ================= View: Course overview ================= */

  function lessonStatus(lid) { return isDone(lid) ? 'done' : isUnlocked(lid) ? 'current' : 'locked'; }

  function viewCourse(main) {
    var pct = Math.round(totalDone() / allLessons().length * 100);
    main.innerHTML =
      '<section class="wrap page-head">' +
        '<div class="page-title" style="--accent:#2d5a3d"><span class="topic-ic">' + icon('signpost') + '</span>' +
          '<div><h1>' + T('ui.course.title') + '</h1><p class="muted">' + T('ui.course.intro') + '</p></div></div>' +
        '<div class="progress-line"><div class="bar"><span style="width:' + pct + '%"></span></div><strong>' + T('ui.learn.progress', { pct: pct }) + '</strong></div>' +
      '</section>' +
      '<section class="wrap course-list">' + LH.MODULES.map(function (m, i) {
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
      '<div class="topic-grid final-grid">' + finalCards() + '</div></section>';
  }

  /* ================= View: Module trail ================= */

  function viewModule(main, mid) {
    var m = mod(mid);
    if (!m) return redirect('#/course');
    var mi = LH.MODULES.indexOf(m);
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

    var nextMod = LH.MODULES[mi + 1];
    main.innerHTML =
      '<section class="wrap page-head">' +
        '<a class="back" href="#/course">' + icon('arrowLeft') + ' ' + T('ui.course.title') + '</a>' +
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
                   : '<a class="btn btn-ghost" href="#/exam">' + icon('trophy') + ' ' + T('ui.exam.title') + '</a>') +
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

  BLOCKS.kit = function () {
    return { html: '<h2 class="block-title">' + icon('backpack') + ' ' + T('ui.forum.kitTitle') + '</h2><div class="card kit kit-inline"></div>', bind: function (el) { renderKit($('.kit', el)); } };
  };

  BLOCKS.planlink = function () {
    return { html: '<a class="tryit tryit-moss" href="#/plan">' + icon('map') + '<div><strong>' + T('ui.plan.title') + '</strong><p>' + T('ui.plan.desc') + '</p></div>' + icon('arrowRight', 'go') + '</a>' };
  };

  /* ================= View: Lesson ================= */

  function viewLesson(main, lid) {
    var m = moduleOf(lid || '');
    if (!m || !en('lessons.' + lid)) return redirect('#/course');
    if (!isUnlocked(lid)) { toast(icon('lock') + ' ' + T('ui.learn.locked')); return redirect('#/module/' + m.id); }

    var idx = m.lessons.indexOf(lid), mi = LH.MODULES.indexOf(m);
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
          var nextMod = LH.MODULES[mi + 1];
          setTimeout(function () {
            celebrate(t('ui.done.moduleTitle'), t('ui.done.moduleBody', { module: t('modules.' + m.id + '.title') }),
              nextMod ? '<a class="btn btn-primary" href="#/module/' + nextMod.id + '" onclick="document.querySelector(\'.modal-close\').click()">' + T('ui.course.nextModule') + '</a>'
                      : '<a class="btn btn-primary" href="#/exam" onclick="document.querySelector(\'.modal-close\').click()">' + icon('trophy') + ' ' + T('ui.exam.title') + '</a>');
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

  /* ================= View: Exam ================= */

  function viewExam(main) {
    var head = '<section class="wrap reader"><a class="back" href="#/course">' + icon('arrowLeft') + ' ' + T('ui.course.title') + '</a>' +
      '<header class="step-head" style="--accent:#6b4a2f"><span class="step-ic">' + icon('trophy') + '</span><div><h1>' + T('ui.exam.title') + '</h1><p class="lead">' + T('ui.exam.desc') + '</p></div></header>';

    if (!examUnlocked()) {
      main.innerHTML = head + '<div class="card locked-card">' + icon('lock') + '<p>' + T('ui.exam.lockedMsg', { n: allLessons().length - totalDone() }) + '</p>' +
        '<a class="btn btn-primary" href="' + (nextLesson() ? '#/lesson/' + nextLesson() : '#/course') + '">' + T('ui.home.continue') + '</a></div>' +
        (S.exam.passed ? certificateHTML() : '') + '</section>';
      bindCert(main);
      return;
    }

    var pool = en('exam.questions');
    var pick = shuffle(pool.map(function (q, i) { return i; })).slice(0, LH.EXAM.count);
    var answers = {};

    main.innerHTML = head +
      '<div class="card exam-info"><p>' + T('ui.exam.rules', { n: pick.length, pct: Math.round(LH.EXAM.pass * 100) }) + '</p>' +
        (S.exam.best ? '<p class="muted small">' + T('ui.exam.best', { score: S.exam.best, total: LH.EXAM.count }) + '</p>' : '') + '</div>' +
      '<div class="quiz exam-q">' + pick.map(function (qi, k) {
        var q = 'exam.questions.' + qi;
        return '<div class="q card" data-k="' + k + '"><small class="q-num">' + T('ui.reader.questionN', { n: k + 1 }) + '</small><h3>' + T(q + '.q') + '</h3>' +
          '<div class="opts">' + t(q + '.o').map(function (o, oi) {
            return '<button class="opt" type="button" data-o="' + oi + '" aria-pressed="false"><span class="opt-key">' + String.fromCharCode(65 + oi) + '</span><span>' + esc(o) + '</span></button>';
          }).join('') + '</div><div class="feedback"></div></div>';
      }).join('') + '</div>' +
      '<div class="reader-foot"><p class="muted small" id="exam-status"></p><button class="btn btn-primary btn-lg" type="button" id="exam-submit" disabled>' + T('ui.exam.submit') + '</button></div>' +
      '<div id="exam-result"></div>' + (S.exam.passed ? certificateHTML() : '') + '</section>';

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
        fb.innerHTML = icon(right ? 'check' : 'close') + '<div><p>' + T('exam.questions.' + qi + '.e') + '</p></div>';
      });
      var passed = score / pick.length >= LH.EXAM.pass;
      var first = passed && !S.exam.passed;
      S.exam.best = Math.max(S.exam.best, score);
      if (passed) { S.exam.passed = true; if (!S.exam.date) S.exam.date = new Date().toISOString().slice(0, 10); }
      if (first) addXP(LH.XP.exam);
      save(); checkBadges();
      $('#exam-result', main).innerHTML = '<div class="card exam-result ' + (passed ? 'pass' : 'fail') + '">' +
        '<div class="celebrate-ic">' + icon(passed ? 'trophy' : 'sprout') + '</div>' +
        '<h2>' + T(passed ? 'ui.exam.passTitle' : 'ui.exam.failTitle') + '</h2>' +
        '<p class="exam-score">' + score + ' / ' + pick.length + '</p>' +
        '<p>' + T(passed ? 'ui.exam.passBody' : 'ui.exam.failBody') + '</p>' +
        '<button class="btn btn-ghost" type="button" id="exam-retry">' + icon('reset') + ' ' + T('ui.exam.retry') + '</button></div>' +
        (passed && !$('.certificate', main) ? certificateHTML() : '');
      $('#exam-retry', main).addEventListener('click', function () { route(); });
      bindCert(main);
      $('#exam-result', main).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    bindCert(main);
  }

  function certificateHTML() {
    return '<div class="card cert-card"><h2 class="block-title">' + icon('star') + ' ' + T('ui.exam.certTitle') + '</h2>' +
      '<label class="plan-field"><span>' + T('ui.exam.certName') + '</span><input type="text" id="cert-name" maxlength="60" value="' + esc(S.exam.name) + '"></label>' +
      '<div class="certificate" id="certificate">' +
        '<div class="cert-in"><span class="brand-mark">' + icon('leaf') + '</span>' +
        '<small>LearnHub</small><h2>' + T('ui.exam.certHeading') + '</h2>' +
        '<p>' + T('ui.exam.certPresented') + '</p><p class="cert-name" id="cert-name-out">' + esc(S.exam.name || '—') + '</p>' +
        '<p>' + T('ui.exam.certBody') + '</p><p class="muted small">' + esc(S.exam.date) + '</p></div></div>' +
      '<div class="row-center"><button class="btn btn-primary" type="button" id="cert-print">' + icon('print') + ' ' + T('ui.exam.certPrint') + '</button></div></div>';
  }
  function bindCert(main) {
    var inp = $('#cert-name', main);
    if (!inp || inp.dataset.bound) return;
    inp.dataset.bound = 1;
    inp.addEventListener('input', function () { S.exam.name = inp.value; $('#cert-name-out', main).textContent = inp.value || '—'; save(); });
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

  setLang(S.lang || detectLang(), false);
})();
