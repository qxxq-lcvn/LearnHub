#!/usr/bin/env node
/*
 * LearnHub translation helper
 * ---------------------------------------------------------------
 * Fills in missing text for a language file by machine-translating the English source
 * (assets/js/i18n/en.js). Existing translations are kept unless you pass --force.
 * Runs once at build time; the website itself never calls a translation API.
 *
 * Providers (both free):
 *   libre     LibreTranslate, open source (AGPL). Self-host it with Docker for unlimited use:
 *               docker run -p 5000:5000 libretranslate/libretranslate
 *             then: --provider libre --url http://localhost:5000
 *   mymemory  MyMemory public API: no key needed; about 5,000 chars/day anonymously,
 *             about 50,000 chars/day if you pass --email you@example.com
 *
 * Usage:
 *   node tools/translate.mjs --to th --provider mymemory --email you@example.com
 *   node tools/translate.mjs --to vi --provider libre --url http://localhost:5000
 *   node tools/translate.mjs --to km --dry-run          (list what is missing)
 *
 * After creating a new language, add it to LH.LANGS in assets/js/data.js.
 * Always have a native speaker review safety-critical text.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const I18N = path.join(ROOT, 'assets', 'js', 'i18n');
const CONTENT = path.join(ROOT, 'assets', 'js', 'content');

// ---------- args ----------
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? def : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true);
};
const to = opt('to');
const provider = opt('provider', 'mymemory');
const url = opt('url', 'http://localhost:5000');
const apiKey = opt('key', '');
const email = opt('email', '');
const force = !!opt('force', false);
const dryRun = !!opt('dry-run', false);

if (!to || to === true) {
  console.error('Usage: node tools/translate.mjs --to <lang-code> [--provider mymemory|libre] [--url URL] [--key KEY] [--email EMAIL] [--force] [--dry-run]');
  process.exit(1);
}

// Language codes differ slightly between providers
const CODE = {
  libre: { zh: 'zh-Hans', 'zh-TW': 'zh-Hant' },
  mymemory: { zh: 'zh-CN', km: 'km-KH' }
};
const target = (CODE[provider] && CODE[provider][to]) || to;

// ---------- load language files ----------
function loadLang(code) {
  // UI strings (i18n/<code>.js) first, then the course content that extends them (content/<code>.js)
  const files = [path.join(I18N, code + '.js'), path.join(CONTENT, code + '.js')].filter((f) => fs.existsSync(f));
  if (!files.length) return null;
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx));
  return ctx.LH.i18n[code];
}

const en = loadLang('en');
const existing = loadLang(to) || {};

// Keys whose values must never be translated
const SKIP = new Set(['ui.appName']);
// Structural fields shared by all languages (block types, icons, links…): never translated
const STRUCT = new Set(['type', 'icon', 'url', 'color', 'scene', 'map']);

// ---------- placeholder protection ----------
// {name} variables, **bold** markers and formulas must survive translation intact.
function protect(text) {
  const tokens = [];
  const out = text
    .replace(/\{\w+\}|√\([^)]*\)|v = [^,.;，。]+/g, (m) => { tokens.push(m); return `[[${tokens.length - 1}]]`; })
    .replace(/\*\*/g, () => { tokens.push('**'); return `[[${tokens.length - 1}]]`; });
  return { out, tokens };
}
function restore(text, tokens) {
  let result = text.replace(/\[\[\s*(\d+)\s*\]\]/g, (m, i) => tokens[+i] ?? m);
  const lost = tokens.filter((tk) => !result.includes(tk));
  return { result, lost };
}

// ---------- providers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateLibre(text) {
  const res = await fetch(url.replace(/\/$/, '') + '/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target, format: 'text', api_key: apiKey || undefined })
  });
  if (!res.ok) throw new Error(`LibreTranslate HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).translatedText;
}

async function translateMyMemory(text) {
  // MyMemory limits each request to ~500 bytes: split long text by sentence
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  const chunks = [];
  let cur = '';
  for (const p of parts) {
    if (Buffer.byteLength(cur + p) > 450 && cur) { chunks.push(cur); cur = ''; }
    cur += p;
  }
  if (cur) chunks.push(cur);
  const out = [];
  for (const c of chunks) {
    const q = new URLSearchParams({ q: c.trim(), langpair: `en|${target}` });
    if (email) q.set('de', email);
    const res = await fetch('https://api.mymemory.translated.net/get?' + q);
    const data = await res.json();
    if (data.responseStatus !== 200) throw new Error(`MyMemory: ${data.responseDetails || data.responseStatus}`);
    out.push(data.responseData.translatedText);
    await sleep(250);
  }
  return out.join(' ');
}

const translateRaw = provider === 'libre' ? translateLibre : translateMyMemory;

async function translate(text) {
  const { out, tokens } = protect(text);
  const translated = await translateRaw(out);
  const { result, lost } = restore(translated, tokens);
  if (lost.length) console.warn(`  ! placeholder lost, please fix by hand: ${lost.join(', ')}`);
  return result;
}

// ---------- walk ----------
let count = 0, chars = 0, failed = 0;

async function walk(src, dst, keyPath) {
  if (Array.isArray(src)) {
    const arr = Array.isArray(dst) && dst.length === src.length ? dst.slice() : new Array(src.length).fill(undefined);
    for (let i = 0; i < src.length; i++) arr[i] = await walk(src[i], arr[i], `${keyPath}[${i}]`);
    return arr;
  }
  if (src && typeof src === 'object') {
    const obj = dst && typeof dst === 'object' && !Array.isArray(dst) ? { ...dst } : {};
    for (const k of Object.keys(src)) obj[k] = await walk(src[k], obj[k], keyPath ? `${keyPath}.${k}` : k);
    return obj;
  }
  if (typeof src !== 'string') return src;
  if (SKIP.has(keyPath) || STRUCT.has(keyPath.split('.').pop()) || !src.trim()) return src;
  if (typeof dst === 'string' && dst.trim() && !force) return dst;

  count++; chars += src.length;
  if (dryRun) { console.log(`  missing: ${keyPath}`); return dst; }
  try {
    const tr = await translate(src);
    console.log(`  ✓ ${keyPath}`);
    return tr;
  } catch (e) {
    failed++;
    console.warn(`  ✗ ${keyPath}: ${e.message}`);
    return dst; // leave missing: the app falls back to English
  }
}

console.log(`Translating en → ${to} with ${provider}${dryRun ? ' (dry run)' : ''}…`);
const result = await walk(en, existing, '');
result.meta = { ...(result.meta || {}), name: (existing.meta && existing.meta.name) || to };

if (dryRun) {
  console.log(`\n${count} strings (${chars} characters) need translation.`);
} else {
  // Split back into the two files: UI strings, and course content (lessons + exam)
  const { lessons, exam, ...ui } = result;
  const key = JSON.stringify(to);
  const uiFile = path.join(I18N, to + '.js');
  const contentFile = path.join(CONTENT, to + '.js');
  fs.writeFileSync(uiFile, 'window.LH = window.LH || {}; LH.i18n = LH.i18n || {};\n' +
    `LH.i18n[${key}] = ` + JSON.stringify(ui, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(contentFile, `window.LH = window.LH || {}; LH.i18n = LH.i18n || {}; LH.i18n[${key}] = LH.i18n[${key}] || {};\n` +
    `LH.i18n[${key}].lessons = ` + JSON.stringify(lessons || {}, null, 2) + ';\n' +
    `LH.i18n[${key}].exam = ` + JSON.stringify(exam || {}, null, 2) + ';\n', 'utf8');
  console.log(`\nWrote ${path.relative(ROOT, uiFile)} and ${path.relative(ROOT, contentFile)}: ${count - failed} strings translated, ${failed} failed.`);
  console.log('Check coverage with: node tools/check-i18n.mjs ' + to);
  if (!LANGS_HAS(to)) console.log(`Next: add { code: '${to}', label: '…' } to LH.LANGS in assets/js/data.js`);
}

function LANGS_HAS(code) {
  const data = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'data.js'), 'utf8');
  return new RegExp(`code:\\s*'${code}'`).test(data);
}
