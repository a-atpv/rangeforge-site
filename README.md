# RangeForge site

Three static pages that satisfy the two URLs App Store Connect requires before you can submit,
plus a landing page:

| File | Serves as |
|---|---|
| `index.html` | **Support URL** (support section is at `#support`) — also the landing page |
| `privacy.html` | **Privacy Policy URL** |
| `terms.html` | Terms of Use (optional for the store; Apple's standard EULA covers the licence) |

No build step, no dependencies, nothing loaded from a CDN. Any static host works.

## Before publishing

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

## Publishing on GitHub Pages (free)

Use a **separate public repository** for the site. Do not publish the main project repo — that
would put the app's full source code, and anything else in the working tree, on the internet.

```sh
# from the project root
mkdir -p ../rangeforge-site && cp -R site/. ../rangeforge-site/
cd ../rangeforge-site
git init && git add -A && git commit -m "RangeForge site"
git branch -M main
git remote add origin https://github.com/<you>/rangeforge-site.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
A minute later the site is live at:

```
https://<you>.github.io/rangeforge-site/
```

Which gives you, for App Store Connect:

- Privacy Policy URL — `https://<you>.github.io/rangeforge-site/privacy.html`
- Support URL — `https://<you>.github.io/rangeforge-site/`

Check both in a browser before pasting them in. App Review does open them, and a 404 on the
privacy URL is a rejection.

## Custom domain later

Buying a domain does not change any of these files. Point it at the same Pages site (Settings →
Pages → Custom domain, plus a `CNAME` file in the repo), then update the two URLs in App Store
Connect. Everything on the pages is relative, so nothing else breaks.

## Keeping it honest

`docs/AppStore/privacy-policy.md` in the main repo is the older plain-text draft this was built
from. `privacy.html` here is the version that gets published and is the one to edit; the two will
drift otherwise.
