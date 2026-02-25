# Denghui Hu — Personal Homepage

A personal portfolio site with a fluid landing animation and a main profile page.

## Features

- **Landing:** Dark background with an interactive fluid canvas — click to spawn random-colored glowing blobs. Centered name “Denghui Hu” in a handwritten style and a “Swipe up to enter” hint.
- **Main page:** Enter by scrolling up (or swiping up on touch). Left: curved card with name, tagline (Health & Wellness), and menu (About, Interests, Publication, Hobbies, LinkedIn). Right: portrait photo.
- **Subpages:** About, Interests, Publication, and Hobbies each have a placeholder page; LinkedIn links to your profile.

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
| `about.html` …    | Placeholder subpages             |
| `Main_photo.PNG`  | Portrait on main page            |
| `placeholder.svg` | Fallback if image path changes   |

## Customize

- **Name / tagline:** Edit the text in `index.html` (landing and hero sections).
- **Photo:** Replace `Main_photo.PNG` or point `src` in `index.html` to your image.
- **LinkedIn:** Update the `href` of the LinkedIn menu link in `index.html` if needed.

## License

MIT.
