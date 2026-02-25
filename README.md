# Denghui Hu — Personal Homepage

A personal portfolio site with a fluid landing animation and a main profile page.

## Features

- **Landing:** Dark background with an interactive fluid canvas — click to spawn random-colored glowing blobs. Centered name “Denghui Hu” in a handwritten style and a “Swipe up to enter” hint.
- **Main page:** Enter by scrolling up (or swiping up on touch). Left: curved card with name, tagline (Life-course epidemiology), and menu (About, Interests, Publication, Hobbies, LinkedIn). Right: portrait photo.
- **Subpages:** About, Interests, Publication, and Hobbies. Publication page lists entries from `publications.json`; you can refresh that file by running the ResearchGate fetch script (see below). LinkedIn links to your profile.

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Then open the URL shown (e.g. http://localhost:3000).

## Structure

| File / folder     | Purpose                          |
|-------------------|----------------------------------|
| `index.html`      | Landing + main page              |
| `styles.css`      | Global styles                    |
| `fluid.js`        | Canvas fluid animation (click)   |
| `scroll-handler.js` | Swipe-up to enter main page   |
| `publication.html` | Publication list (reads `publications.json`) |
| `publications.json` | Data for the Publication page (edit by hand or generate with script) |
| `scripts/fetch-publications-from-researchgate.js` | Optional: fetch from ResearchGate profile → `publications.json` |
| `about.html` …    | Other subpages                   |
| `Main_photo.PNG`  | Portrait on main page            |
| `placeholder.svg` | Fallback if image path changes   |

## Publication list (auto-fetch from ORCID)

To refresh the list from your [ORCID](https://orcid.org/0000-0002-1908-9637) **Works**:

```bash
node scripts/fetch-publications-from-orcid.js
```

No `npm install` needed: the script uses the public ORCID API (no API key) and Node’s built-in `fetch`. It overwrites `publications.json` with title, year, venue, and link (DOI/URL) for each work.

- **ORCID ID** is set in the script (`scripts/fetch-publications-from-orcid.js`). Change `ORCID_ID` if you use a different profile.
- You can also edit `publications.json` by hand; each item can have `title`, `authors`, `year`, `venue`, `url`.
- Optional: to fetch from ResearchGate instead, run `npm install` then `npm run fetch-publications:researchgate` (uses Puppeteer).

## Customize

- **Name / tagline:** Edit the text in `index.html` (landing and hero sections).
- **Photo:** Replace `Main_photo.PNG` or point `src` in `index.html` to your image.
- **LinkedIn:** Update the `href` of the LinkedIn menu link in `index.html` if needed.
- **Publications:** Edit `publications.json` or run `npm run fetch-publications` (see above).

## License

MIT.
