# Aidan Wolter - Personal Website (`aidanwolter.com`)

A plain, static personal site: one page with a short bio, work history, a few projects and links. No build step and
no scripts on the home page; `index.html`, `style.css` and `favicon.svg` are the whole of it.

- **Look**: ivory background (`#f6f4ef`), ink text, Newsreader for headings and Inter for body text (Google Fonts),
  blue (`#1f3fbf`) only on link underlines. Colours are variables at the top of `style.css`.
- **Favicon**: an AW monogram, ink on ivory, where the A's right leg is the W's first stroke. It is drawn with
  shapes rather than text, so it doesn't depend on a font.
- **Phones**: the sections stack on narrow screens; there is no separate mobile layout.

## 🛠 Local preview

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## 🌐 Hosting

GitHub Pages from `main` (root `/`), with `CNAME` pointing at aidanwolter.com.

---

## 🧩 The Construct pages

`/construct/`, `/events/`, `/recipes/` and `/design/` are drawn by The Construct's web client, loaded from the pod
server (`https://the-construct-pod.fly.dev/web/mount.js`), which lists this site in `CONSTRUCT_SITE_ORIGINS`
(The Construct's decision `site-origins`). The site stays static; the client and its data come from the server.

- **`/construct/`** opens Aidan's pod. "Open my pod" goes to the server's own page for the pod code, which sends
  the browser back here with a session kept in this site's `localStorage`.
- **`/events/`, `/recipes/`, `/design/`** are the public links `/aidan/<slug>`, for anyone. A row's own address,
  such as `/recipes/<recipe>`, has no file: `404.html` (the same page) opens it.
- To add another public link at `/<slug>/`, share it with that slug in the pod, then copy `recipes/index.html` to
  `<slug>/index.html` and change its title and description.
- Each page's Content-Security-Policy allows scripts only from this site and the pod server. The pod's session lives
  on this origin, so keep third-party scripts (analytics, embeds) off these pages.
- `construct.css` styles them.

