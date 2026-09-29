#!/usr/bin/env node
/*
 * Checks that every language has a translation for every English string
 * (UI files in assets/js/i18n and course content in assets/js/content).
 * Usage: node tools/check-i18n.mjs            (all languages)
 *        node tools/check-i18n.mjs km          (one language)
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
const load = (rel) => { const f = path.join(ROOT, rel); if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx); };

load('assets/js/data.js');
const langs = process.argv[2] ? [process.argv[2]] : ctx.LH.LANGS.map((l) => l.code).filter((c) => c !== 'en');
for (const code of ['en', ...langs]) {
  load(`assets/js/i18n/${code}.js`);
  load(`assets/js/content/${code}.js`);
}

function leaves(obj, prefix = '', out = []) {
  if (typeof obj === 'string') { out.push([prefix, obj]); return out; }
  if (Array.isArray(obj)) { obj.forEach((v, i) => leaves(v, `${prefix}.${i}`, out)); return out; }
  if (obj && typeof obj === 'object') for (const k of Object.keys(obj)) leaves(obj[k], prefix ? `${prefix}.${k}` : k, out);
  return out;
}
const get = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const en = ctx.LH.i18n.en;
// structural fields (block type, icons, colours, links, scene ids) are shared, not translated
const STRUCT = new Set(['type', 'icon', 'url', 'color', 'scene', 'map']);
const enLeaves = leaves(en).filter(([p]) => !p.startsWith('meta.') && p !== 'ui.footer.translation' && !STRUCT.has(p.split('.').pop()));
let failed = false;
for (const code of langs) {
  const tr = ctx.LH.i18n[code];
  if (!tr) { console.log(`${code}: not found`); failed = true; continue; }
  const missing = enLeaves.filter(([p]) => typeof get(tr, p) !== 'string' || !get(tr, p).trim()).map(([p]) => p);
  // placeholders such as {n} must survive translation
  const broken = enLeaves.filter(([p, v]) => {
    const t = get(tr, p);
    return typeof t === 'string' && (v.match(/\{\w+\}/g) || []).some((ph) => !t.includes(ph));
  }).map(([p]) => p);
  console.log(`${code}: ${enLeaves.length - missing.length}/${enLeaves.length} strings translated` +
    (missing.length ? `, missing ${missing.length}` : '') + (broken.length ? `, broken placeholders ${broken.length}` : ''));
  if (missing.length) console.log('  missing: ' + missing.slice(0, 20).join(', ') + (missing.length > 20 ? ' …' : ''));
  if (broken.length) console.log('  placeholders: ' + broken.join(', '));
  if (missing.length || broken.length) failed = true;
}
process.exit(failed ? 1 : 0);
