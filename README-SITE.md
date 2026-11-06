# HistoryOsis website

Plain HTML, CSS and JS. No build step. Upload the contents of this folder to the site root (Netlify drag and drop works).

## Pages
index, app-tour, features, differentials, who-its-for, privacy-safety, whats-new, roadmap, get-involved, faq, about, 404.
Old single-page links such as `historyosis.tech/#privacy` forward to the right page (see `assets/js/site.js`).

## Theme
Light, Dark or Auto (follows the device). The Theme button is in the header of every page and remembers the choice in the browser. App screenshots swap with the theme: every screen exists as `app-NAME-light.webp` and `app-NAME-dark.webp` in `assets/img`.

## Updating
- New screenshots: replace the two files for that screen (585 x 1230 px).
- Version line: search for `v3.37.1` in the pages.
- Shared styles: `assets/css/site.css`. Colours are tokens at the top of the file.

## Notes
- Screens show fictional patients only.
- Fonts load from Google Fonts. Everything else is local.
- Links use `.html` file names so they work on any host.
