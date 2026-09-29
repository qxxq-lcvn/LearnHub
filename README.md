# 🌿 LearnHub

A free, static, interactive learning site with courses in two categories:

- **Emergency preparedness** — *Tsunami & Disaster Risk Reduction* (4 modules)
- **Health** — *Cancer* (3 modules)

Learners follow each course along a winding learning trail, practise with quizzes and hands-on
activities, experiment in interactive **labs**, write reflections and take a final **exam** with a
printable certificate. It works in **English, Khmer (ខ្មែរ), Chinese (中文) and Japanese (日本語)**.

No build step, no server, no database, no API keys. It is pure HTML, CSS and JavaScript,
so it can be hosted for free on GitHub Pages with no usage limits.

## Emergency: Tsunami & Disaster Risk Reduction

| Module | Lessons |
|---|---|
| **1. Understanding Disaster Risk Reduction** | SDGs and the Sendai Framework · 2011 Great East Japan Earthquake and Tsunami · Goryo Hamaguchi and World Tsunami Awareness Day · Introduction to DRR · The DRR Cycle · DRR Planning · Reflection |
| **2. Learning from Japan's Experience** | The Miracle of Kamaishi · Arahama Elementary School overview · Virtual tour: Arahama (parts 1–2) · Virtual tour: Okawa (parts 1–2) · Reflection |
| **3. Learning from Disasters Across the Asia-Pacific** | 2004 Indian Ocean Tsunami · Samoa–Tonga Tsunami · 2018 Sunda Strait Tsunami · Early Warning Systems · A Changing Climate and DRR · The Role of Youth in DRR · Youth-Led Actions: Mapanas, Philippines · Reflection |
| **4. Preparing for Future Disasters** | Leave No One Behind: elderly people · Leave No One Behind: persons with disabilities · Community-Based DRR · Building Back Better · Emergency Box · Prepare Your Own Go-Bag (with a packing game) · Reflection |
| **Lab** | Tsunami Wave Simulator |
| **Final exam** | 20 questions drawn from a pool of 32; 70% to pass; printable certificate |
| **DRR Plan** | 8-section household plan builder; print or save as text |

## Health: Cancer

| Module | Lessons |
|---|---|
| **1. Understanding cancer** | What is cancer? · Types of cancer · Stages of cancer · How cancer spreads · Reflection |
| **2. Why cancer is hard to cure** | Our own cells gone rogue · Evolution and resistance · Hiding and late detection · Reflection |
| **3. Treatments and solutions** | Surgery and radiation · Chemotherapy vs cancer · Targeted therapy and immunotherapy · CAR T cells · Other solutions and the future · Prevention and early detection · Reflection |
| **Lab** | Cancer Treatment Lab — a turn-based tumour simulation with surgery, radiation, chemotherapy, targeted therapy, immunotherapy and CAR T cells; shows how resistant cells take over when one treatment is used alone |
| **Final exam** | 20 questions drawn from a pool of 34; 70% to pass; printable certificate |

The Cancer topic is general education, not medical advice; the app says so on the topic page and in the lab.

### Content types used in lessons

Text, key statistics, timelines, flip cards, comparison tables, an interactive DRR cycle,
a risk-equation calculator, illustrated **virtual tours** with hotspots, an interactive
**Asia-Pacific map**, sorting activities, ordering activities, "what would you do?" scenarios,
quizzes with instant feedback, private reflection journals, the go-bag checklist,
links to the labs, and links to official sources.

### Other features

- **Tsunami simulator** — shallow-water wave equation `v = √(g·d)`, arrival time, shoaling height estimate, animated ocean cross-section
- **Survival Forum** — searchable Q&A knowledge base and go-bag checklist
- **Cancer Treatment Lab** — 4 groups of cancer cells (sensitive, chemo-resistant, no drug target, hidden from CAR T), patient health, spread, and a log-scale chart of tumour size
- **Gamification** — XP, levels (Seed → Sprout → Sapling → Tree → Forest), 19 badges
- Progress, reflections and the plan are saved **only in the learner's browser** (`localStorage`)

## Project structure

```
index.html                 App shell
assets/
  logo/svg/                Logo, mark and favicon (light variants for dark backgrounds)
  logo/png/                App icons 16–512 px (favicon, apple-touch-icon)
  css/style.css            Nature theme and core layout
  css/course.css           Course blocks, exam, certificate, plan, print styles
  js/icons.js              Hand-drawn nature SVG icon set
  js/data.js               Structure: languages, categories, topics, modules, badges, levels, plan options, map pins
  js/scenes.js             Illustrated scenes for the virtual tours
  js/sim.js                Tsunami physics + animated simulator
  js/app.js                Router, state, i18n, lesson block renderers, all views (incl. the Cancer Lab)
  js/i18n/<lang>.js        Interface text, forum, checklist, badges
  js/content/<lang>.js     DRR lessons and exam questions (en.js is the source of truth)
  js/content/cancer-<lang>.js  Cancer lessons and exam questions (cancer-en.js is the source of truth)
tools/translate.mjs        Machine-translate missing text for a new language
tools/check-i18n.mjs       Check every language covers every English string
.nojekyll                  Tells GitHub Pages to serve files as-is
```

## Run locally

Serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages (free)

1. Create a new public repository on GitHub and push this folder to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`.

All paths are relative, so it works from a sub-folder URL. It also works on Netlify,
Cloudflare Pages, or any static host.

## Editing content

Lessons are data, not code. Each lesson in `assets/js/content/en.js` is a list of blocks, for example:

```js
{ "type": "quiz", "questions": [
  { "q": "Question?", "o": ["Option A", "Option B", "Option C"], "a": 1, "e": "Explanation" }
] }
```

Block types: `text`, `fact`, `quote`, `stats`, `timeline`, `cards`, `compare`, `cycle`, `risk`,
`tour`, `map`, `sort`, `order`, `scenario`, `quiz`, `reflect`, `links`, `sim`, `lab`, `kit`,
`gobag`, `planlink`.
Structure (block types, answers, icons, links) always comes from the English file; other languages
only provide the text, in the same order. After editing, run:

```bash
node tools/check-i18n.mjs
```

### Add a new topic

1. In `assets/js/data.js`, give the topic in `LH.TOPICS` `available: true`, a `lab` and an `exam` key,
   and add its modules to `LH.MODULES` (with `topic: '<id>'`) and icons to `LH.LESSON_ICONS`.
2. Create `assets/js/content/<topic>-<lang>.js` with `lessons` and the exam pool, and load it in
   `index.html` (English) and in `loadLang()` in `app.js` (other languages).
3. Add `topics.<id>` and `modules.<id>` text to each `assets/js/i18n/<lang>.js`.

After changing any CSS or JS file, bump the `?v=` number in `index.html` and `ASSET_V` in `app.js`
so returning visitors get the new files.

## Languages & translation

All translations ship **pre-built**, so the live site never calls a translation API: no quotas,
no keys. Missing strings fall back to English automatically.

The Khmer, Chinese and Japanese texts were translated with AI assistance. Because this is
safety content, **please have native speakers review them** before wider use.

To add a language, `tools/translate.mjs` fills in missing strings using free services:

- **LibreTranslate** (open source). Self-host it for unlimited, private use:
  ```bash
  docker run -p 5000:5000 libretranslate/libretranslate
  ```
  ```bash
  node tools/translate.mjs --to vi --provider libre --url http://localhost:5000
  ```
- **MyMemory** (free public API): about 50,000 characters/day with an email. The full course is
  about 80,000 characters, so run it on two days — it only translates what is still missing.
  ```bash
  node tools/translate.mjs --to th --provider mymemory --email you@example.com
  ```

Then add the language to `LH.LANGS` in `assets/js/data.js`.

## Sources

Facts were checked against public sources including UNDRR, the United Nations, the City of Sendai,
Ishinomaki City, Japan for Sustainability, JICA, WMO, IPCC AR6 and published case records.
Links to the main sources appear at the end of the relevant lessons.

## Disclaimer

Educational content only. Always follow instructions from your local authorities.
