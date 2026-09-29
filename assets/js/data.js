/* LearnHub static configuration: structure only.
 * UI text lives in assets/js/i18n/<lang>.js, lesson content in assets/js/content/<lang>.js */
window.LH = window.LH || {};

/* To add a language: create both files (see tools/translate.mjs) and add it here. */
LH.LANGS = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' }
];

/* Extra web fonts loaded only when that language is selected */
LH.FONT_LINKS = {
  zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap',
  ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap'
};

/*
 * COURSE — 4 modules. Lesson text, activities and answer keys live in content/en.js
 * under lessons.<id>. Lessons unlock in order inside each module.
 */
LH.MODULES = [
  { id: 'm1', icon: 'compass', accent: '#2d5a3d', lessons: ['m1l1', 'm1l2', 'm1l3', 'm1l4', 'm1l5', 'm1l6', 'm1r'] },
  { id: 'm2', icon: 'school', accent: '#1f6f8b', lessons: ['m2l1', 'm2l2', 'm2l3', 'm2l4', 'm2l5', 'm2l6', 'm2r'] },
  { id: 'm3', icon: 'globe', accent: '#b8891f', lessons: ['m3l1', 'm3l2', 'm3l3', 'm3l4', 'm3l5', 'm3l6', 'm3l7', 'm3r'] },
  { id: 'm4', icon: 'users', accent: '#c8643b', lessons: ['m4l1', 'm4l2', 'm4l3', 'm4l4', 'm4l5', 'm4l6', 'm4r'] }
];

/* Icon per lesson (shown on the trail) */
LH.LESSON_ICONS = {
  m1l1: 'target', m1l2: 'wave', m1l3: 'fire', m1l4: 'shield', m1l5: 'cycle', m1l6: 'map', m1r: 'book',
  m2l1: 'mountain', m2l2: 'school', m2l3: 'pin', m2l4: 'eye', m2l5: 'pin', m2l6: 'heart', m2r: 'book',
  m3l1: 'wave', m3l2: 'wave', m3l3: 'volcano', m3l4: 'radio', m3l5: 'sun', m3l6: 'sprout', m3l7: 'flag', m3r: 'book',
  m4l1: 'hand', m4l2: 'access', m4l3: 'users', m4l4: 'home', m4l5: 'box', m4l6: 'backpack', m4r: 'book'
};

/* Hazard library shown on the home page (tsunami is covered by the course) */
LH.HAZARDS = [
  { id: 'tsunami', icon: 'wave', accent: '#1f6f8b', course: true },
  { id: 'earthquake', icon: 'quake', accent: '#8a5a3b' },
  { id: 'flood', icon: 'flood', accent: '#2f86a6' },
  { id: 'typhoon', icon: 'storm', accent: '#4f7590' },
  { id: 'landslide', icon: 'landslide', accent: '#7a6a3a' },
  { id: 'wildfire', icon: 'fire', accent: '#c8643b' },
  { id: 'drought', icon: 'drought', accent: '#b8891f' },
  { id: 'volcano', icon: 'volcano', accent: '#a3462d' },
  { id: 'heatwave', icon: 'heat', accent: '#d2772a' }
];

LH.BADGES = [
  { id: 'first_sprout', icon: 'sprout' },
  { id: 'module_m1', icon: 'compass' },
  { id: 'module_m2', icon: 'school' },
  { id: 'module_m3', icon: 'globe' },
  { id: 'module_m4', icon: 'users' },
  { id: 'reflective', icon: 'book' },
  { id: 'sharp_eye', icon: 'eye' },
  { id: 'wave_scientist', icon: 'flask' },
  { id: 'deep_diver', icon: 'anchor' },
  { id: 'wise_owl', icon: 'owl' },
  { id: 'ready_pack', icon: 'backpack' },
  { id: 'plan_maker', icon: 'map' },
  { id: 'exam_pass', icon: 'trophy' },
  { id: 'world_voice', icon: 'globe' }
];

LH.LEVELS = [
  { id: 'seed', xp: 0, icon: 'seed' },
  { id: 'sprout', xp: 100, icon: 'sprout' },
  { id: 'sapling', xp: 300, icon: 'leaf' },
  { id: 'tree', xp: 600, icon: 'tree' },
  { id: 'forest', xp: 1000, icon: 'forest' }
];

LH.XP = { lesson: 20, firstTry: 10, activity: 10, badge: 15, exam: 100, plan: 50 };

LH.EXAM = { count: 20, pass: 0.7 };

LH.FORUM_CATS = [
  { id: 'before', icon: 'backpack' },
  { id: 'during', icon: 'mountain' },
  { id: 'after', icon: 'home' },
  { id: 'myths', icon: 'alert' }
];

LH.FORUM = [
  { id: 't1', cat: 'before' },
  { id: 't2', cat: 'before' },
  { id: 't3', cat: 'before' },
  { id: 't4', cat: 'during' },
  { id: 't5', cat: 'during' },
  { id: 't6', cat: 'during' },
  { id: 't7', cat: 'after' },
  { id: 't8', cat: 'after' },
  { id: 't9', cat: 'myths' },
  { id: 't10', cat: 'myths' },
  { id: 't11', cat: 'myths' }
];

LH.KIT = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'k11', 'k12'];

/* DRR Plan builder: option lists (labels in ui.plan.opts.*) */
LH.PLAN = {
  needs: ['elderly', 'children', 'disability', 'medical', 'pregnant', 'pets'],
  hazards: ['tsunami', 'earthquake', 'flood', 'typhoon', 'landslide', 'wildfire', 'heatwave', 'volcano'],
  alerts: ['phone', 'radio', 'siren', 'tv', 'leader', 'social'],
  required: ['hazards', 'site1', 'meeting', 'contact']
};

LH.SIM_PRESETS = [
  { id: 'local', m: 7.8, dist: 80, depth: 1000 },
  { id: 'regional', m: 8.5, dist: 800, depth: 3000 },
  { id: 'far', m: 9.0, dist: 7000, depth: 4500 }
];

/* Reference speeds (km/h) for the simulator comparison chart */
LH.SPEEDS = [
  { id: 'cheetah', kmh: 110 },
  { id: 'car', kmh: 120 },
  { id: 'train', kmh: 320 },
  { id: 'jet', kmh: 900 }
];

/* Map pins (longitude, latitude) for map blocks; labels live in the lesson content */
LH.MAPS = {
  asiapacific: {
    center: [140, 5], scale: 1.05,
    pins: [[95.98, 3.3], [-172.1, -15.5], [105.42, -6.1], [142.37, 38.3], [125.25, 12.47], [135.17, 34.07]]
  }
};
