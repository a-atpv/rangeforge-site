# RangeForge site

Three static pages that satisfy the two URLs App Store Connect requires before you can submit,
plus a landing page:

| File | Serves as |
|---|---|
| `index.html` | **Support URL** (support section is at `#support`) — also the landing page |
| `privacy.html` | **Privacy Policy URL** |
| `terms.html` | Terms of Use (optional for the store; Apple's standard EULA covers the licence) |
| `samples/` | **Sample-files URL given to App Review** — synthetic hand histories + a zip |
| `img/` | the Mac App Store badges and the landing page's screenshots |

`samples/` exists because App Review rejected 1.0 (2) under guideline 2.1(a): the replayer and the
tournament library need a hand-history file before they show anything, and the reviewer had none.
The same twelve files are also bundled inside the app (`Resources/SampleData`, loaded by the
"Open the sample session" / "Load the sample tournaments" buttons), so the in-app path does not
depend on this page staying up — but Apple asked for a hosted copy that stays available for future
reviews, and this is it. **Do not delete or move `samples/`**, and regenerate the zip if the files
under `samples/files/` ever change:

```sh
cd site/samples && rm -f RangeForge-sample-hands.zip && zip -q -j RangeForge-sample-hands.zip files/*.txt
```

`.nojekyll` turns GitHub Pages' Jekyll pass off. It exists for `samples/files/`, whose names carry
`#`, `$`, spaces and brackets (they are real GG export names) — Jekyll is free to skip or rewrite
files like that, and with it off the tree is served byte-for-byte as committed.

No build step, no dependencies, nothing loaded from a CDN. Any static host works.

## Content decisions worth remembering

1. **Support address.** The pages currently show `aldiyar.dev@gmail.com`, chosen to get the site
   live without waiting on a domain. To move to a `support@` address later, swap it in one pass and
   redeploy — the URL in App Store Connect stays valid, so this can be done after release:

   ```sh
   cd site && sed -i '' 's/aldiyar\.dev@gmail\.com/support@yourdomain.tld/g' index.html privacy.html terms.html
   ```

   A `support@` address needs a domain you own, but mail hosting for it does not have to cost
   anything — Cloudflare Email Routing forwards `support@yourdomain` to an existing inbox for free,
   which is plenty for an address that receives a handful of messages.

2. There is deliberately **no governing-law clause**. App Store copies are licensed under Apple's
   standard EULA, which carries its own; adding a second one is optional and was dropped rather
   than left as a placeholder.

3. Re-read the privacy text against what the app actually does. It is accurate as of the current
   build — no network entitlement, no analytics, hand histories read locally only. **If a future
   version ever gains network access, this policy stops being true and must be rewritten.**

## Live — deployed 20 July 2026

Published on GitHub Pages from a **separate public repository**,
[a-atpv/rangeforge-site](https://github.com/a-atpv/rangeforge-site), checked out at
`~/Desktop/rangeforge-site`. It is deliberately not this repo: publishing this one would put the
app's entire source on the internet.

For App Store Connect:

- Privacy Policy URL — `https://a-atpv.github.io/rangeforge-site/privacy.html`
- Support URL — `https://a-atpv.github.io/rangeforge-site/`

### Redeploying after an edit

This directory is the source of truth; the deploy checkout is a copy — but **not a straight one**.
The direct-download section is committed here ahead of the first DMG release, and until that
release exists its button would be a 404 on Apple's Support URL. Every part of it (the section, its
footer link, its CSS and its notes in this README) is fenced between `dmg-only` marker lines, and
`deploy_site.sh` in the main repo copies `site/` with those blocks cut out. It refuses to finish if a
marker or a release link survives. Edit here, then:

```sh
./deploy_site.sh
cd ~/Desktop/rangeforge-site && git diff && git add -A && git commit -m "..." && git push
```

On the day the first DMG is published (RF-003/RF-004), delete the marker lines — keep what is
between them — and redeploy.

Pages rebuilds in under a minute. Verify before assuming it worked — App Review opens these, and a
404 on the privacy URL is a rejection:

```sh
for u in "" privacy.html terms.html; do
  curl -sS -o /dev/null -w "%{http_code}  $u\n" "https://a-atpv.github.io/rangeforge-site/$u"
done
```

## The Mac App Store badge

The hero links to `https://apps.apple.com/app/id6792839425` (RangeForge, `com.RangeForge.app`).
The URL names no storefront on purpose: Apple redirects each visitor to their own country's store
and adds `mt=12` itself. To count the site's downloads in App Analytics, swap in a campaign link
from App Store Connect (`?pt=<provider token>&ct=site_en`, and `site_ru` on the Russian badge).

`img/mac-app-store-badge-en.svg` and `-ru.svg` are Apple's own artwork, downloaded unmodified from
toolbox.marketingtools.apple.com (black badge, en-us and ru-ru). The App Store marketing guidelines
allow no recolouring or redrawing and nothing shorter than 40 px on screen; the page shows them
at 44 px.

## Screenshots

`img/<screen>-<lang>-<width>.webp` — Nash, the library's GTO review and the replayer, once per
language, at 1880 and 1100 px. `docs/AppStore/make_web_screenshots.py` in the main repo makes them
from 2880×1800 window captures; its docstring says how they were taken. The page never names a
poker room or shows a money amount — the same rule as the store listing — so the library is
shown through its review panels rather than its money columns, and the replayer is cropped to
the table.

## Custom domain later

Buying a domain does not change any of these files. Point it at the same Pages site (Settings →
Pages → Custom domain, plus a `CNAME` file in the repo), then update the two URLs in App Store
Connect. Everything on the pages is relative, so nothing else breaks.

## Keeping it honest

`docs/AppStore/privacy-policy.md` in the main repo is the older plain-text draft this was built
from. `privacy.html` here is the version that gets published and is the one to edit; the two will
drift otherwise.
