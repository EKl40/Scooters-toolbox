# GitHub Pages for Scooter’s Toolbox

GitHub Pages only serves **static** files. PHP (`counter_v2.php`, etc.) is **not** executed on `github.io`. This repo uses **GitHub Actions** to publish a trimmed copy of the site and patch **every HTML file under `_site`** so:

- **SEO** (`canonical`, `og:url`, JSON-LD, `sitemap.xml`, `robots.txt`) → **primary host** `https://scooterstoolbox.com/`  
  (mirrors must not compete in Google as a second “original”)
- **STX metas** (track / counter / items-bump) → **PHP on** `https://scooterstoolbox.com`

The GitHub Pages URL stays useful as a mirror / backup:

`https://squ1ggs.github.io/Scooters-toolbox-V2/`

## One-time setup

1. Push this repo to GitHub (branch `main`).
2. Repo **Settings → Pages**.
3. **Build and deployment → Source:** **GitHub Actions** (not “Deploy from branch”).
4. Run the workflow: **Actions → Deploy GitHub Pages → Run workflow**, or push to `main`.

## Other mirrors (Netlify, save-editor.be)

Same pattern:

1. Keep the static site available if you want.
2. Prefer **301 redirect** to `https://scooterstoolbox.com/`, **or** leave them up with `rel=canonical` → scooterstoolbox.com.
3. Point STX metas at `https://scooterstoolbox.com` for shared counters.

## Change hosts

Edit `.github/workflows/deploy-github-pages.yml`:

```yaml
SEO_CANONICAL_HOST: https://scooterstoolbox.com
STX_SHARED_API_BASE: https://scooterstoolbox.com
GHPAGES_SITE_URL: https://squ1ggs.github.io/Scooters-toolbox-V2/   # informational only
```

## Local test of the patch

```bash
mkdir -p _site && cp -r assets legacy index.html robots.txt sitemap.xml _site/
export SEO_CANONICAL_HOST=https://scooterstoolbox.com
export STX_SHARED_API_BASE=https://scooterstoolbox.com
export GHPAGES_SITE_URL=https://squ1ggs.github.io/Scooters-toolbox-V2/
node scripts/patch-index-for-github-pages.mjs _site
```

Then confirm `_site/index.html` still has `canonical` → scooterstoolbox.com and STX metas → scooterstoolbox.com PHP.
