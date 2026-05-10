# Lovis

> Book talented musicians and bands across Poland — like Airbnb, but for live music.

Lovis is a marketplace platform that helps event hosts in Poland find and book
musicians, bands and DJs for weddings, corporate events, parties and ceremonies.
Built in English, prices in PLN (zł).

## Live demo

This site is a static front-end (HTML, CSS, vanilla JS) — no build step.
Open `index.html` in any browser, or host the folder on GitHub Pages /
Netlify / Vercel.

## Pages

| File           | Description                                              |
| -------------- | -------------------------------------------------------- |
| `index.html`   | Homepage — search bar + featured musician rows           |
| `listing.html` | Individual musician profile + booking widget             |
| `join.html`    | "Become a musician" sign-up form                         |

## Project structure

```
.
├── index.html        # homepage
├── listing.html      # musician detail page (uses ?id= query param)
├── join.html         # musician sign-up
├── styles.css        # all styles
├── data.js           # sample musician data
├── script.js         # UI logic (rendering, search, booking)
└── README.md
```

## Customising

* **Add a musician** → append a new entry to `window.LOVIS_DATA.musicians`
  in `data.js`. Each musician needs `id`, `name`, `title`, `city`, `genre`,
  `pricePln`, `rating`, `reviews`, `photos` (5 image URLs), `bio` and
  `highlights` (3 items).
* **Change brand colour** → edit `--brand` in `styles.css`.
* **Change copy / regions** → all text is in the HTML files; cities are listed
  in `join.html` and the data file.

## Deploying to GitHub Pages

1. Push to GitHub (this repo: `renatazawicka-glitch/Lovis`).
2. In **Settings → Pages**, select branch `claude/create-lovis-platform-7gBSf`
   (or `main` after merging) and folder `/`.
3. Visit the URL GitHub provides.

## Notes on the repo name

The original brief asked for a repo named `Lovis-platform`. The remote
provisioned for this session is `renatazawicka-glitch/Lovis`, so this code
lives there. To rename: **Settings → General → Rename** on GitHub.

## Roadmap

- [ ] Real backend (auth, payments via Przelewy24/Stripe, messaging)
- [ ] Musician dashboard for managing the calendar
- [ ] Reviews & ratings flow after each booking
- [ ] Polish-language toggle
- [ ] Map view for browsing musicians by city

---

© 2026 Lovis sp. z o.o. · Warszawa, Poland
