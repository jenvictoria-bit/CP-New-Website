# Career Prep Website

The website for Career Prep School.

## What's in here

This is a static website (HTML, CSS, and JavaScript — no build step required).

| File | Purpose |
| --- | --- |
| `index.html` | The main page of the site |
| `styles.css` | All styling for the site |
| `script.js` | Interactive behavior |
| `site-config.js` | Site content/configuration |
| `netlify.toml` / `vercel.json` | Deployment settings (Netlify / Vercel) |
| `*.jpg`, `*.png`, `*.webp`, `*.svg` | Images used across the site |
| `*.pdf` | School calendars |

## Running it locally

Because it's a static site, you can open `index.html` directly in a browser,
or serve the folder with any static server, for example:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

The site is configured for deployment on Netlify (`netlify.toml`) and
Vercel (`vercel.json`).
