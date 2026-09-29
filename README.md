# 🌿 LearnHub

A free, static, interactive web course on **Disaster Risk Reduction (DRR)**. Learners follow four
modules along a winding learning trail, explore virtual tours and interactive maps, practise with
quizzes and activities, write reflections, take a final exam, and build their own household DRR plan.
It works in **English, Khmer (ខ្មែរ), Chinese (中文) and Japanese (日本語)**.

No build step, no server, no database, no API keys. It is pure HTML, CSS and JavaScript,
so it can be hosted for free on GitHub Pages with no usage limits.

## Course

| Module | Lessons |
|---|---|
| **1. Understanding Disaster Risk Reduction** | SDGs and the Sendai Framework · 2011 Great East Japan Earthquake and Tsunami · Goryo Hamaguchi and World Tsunami Awareness Day · Introduction to DRR · The DRR Cycle · DRR Planning · Reflection |
| **2. Learning from Japan's Experience** | The Miracle of Kamaishi · Arahama Elementary School overview · Virtual tour: Arahama (parts 1–2) · Virtual tour: Okawa (parts 1–2) · Reflection |
| **3. Learning from Disasters Across the Asia-Pacific** | 2004 Indian Ocean Tsunami · Samoa–Tonga Tsunami · 2018 Sunda Strait Tsunami · Early Warning Systems · A Changing Climate and DRR · The Role of Youth in DRR · Youth-Led Actions: Mapanas, Philippines · Reflection |
| **4. Preparing for Future Disasters** | Leave No One Behind: elderly people · Leave No One Behind: persons with disabilities · Community-Based DRR · Building Back Better · Emergency Box · Prepare Your Own Go-Bag · Reflection |
| **Final exam** | 20 questions drawn from a pool of 32; 70% to pass; printable certificate |
| **DRR Plan** | 8-section household plan builder; print or save as text |

### Content types used in lessons

Text, key statistics, timelines, flip cards, comparison tables, an interactive DRR cycle,
a risk-equation calculator, illustrated **virtual tours** with hotspots, an interactive
**Asia-Pacific map**, sorting activities, ordering activities, "what would you do?" scenarios,
quizzes with instant feedback, private reflection journals, the go-bag checklist,
the tsunami physics simulator and links to official sources.

### Other features

- **Tsunami simulator** — shallow-water wave equation `v = √(g·d)`, arrival time, shoaling height estimate, animated ocean cross-section
- **Survival Forum** — searchable Q&A knowledge base and go-bag checklist
- **Gamification** — XP, levels (Seed → Sprout → Sapling → Tree → Forest), 14 badges
- Progress, reflections and the plan are saved **only in the learner's browser** (`localStorage`)

## Project structure

```
index.html                 App shell
assets/
  favicon.svg
  css/style.css            Nature theme and core layout
  css/course.css           Course blocks, exam, certificate, plan, print styles
  js/icons.js              Hand-drawn nature SVG icon set
  js/data.js               Structure: languages, modules, badges, levels, plan options, map pins
  js/scenes.js             Illustrated scenes for the virtual tours
  js/sim.js                Tsunami physics + animated simulator
  js/app.js                Router, state, i18n, lesson block renderers, all views
  js/i18n/<lang>.js        Interface text, forum, checklist, badges
  js/content/<lang>.js     Lesson content and exam questions (en.js is the source of truth)
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
`tour`, `map`, `sort`, `order`, `scenario`, `quiz`, `reflect`, `links`, `sim`, `kit`, `planlink`.
Structure (block types, answers, icons, links) always comes from the English file; other languages
only provide the text, in the same order. After editing, run:

```bash
node tools/check-i18n.mjs
```

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
