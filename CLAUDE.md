# app-lanterns

Small apps, one folder each under `apps/`, each a progressive web app (PWA) in its `app/` folder,
with a catalog site that describes them and also hosts them. This file has two halves: helping
someone install an app, and building a new one.

## Helping someone install an app

Assume the person has never installed a web app.

1. Open the app's page on https://tinwright.github.io/app-lanterns and click **Open the app**.
2. It works there and then, in the browser. To keep it like any other app:
   - **Chrome or Edge** (Windows, Mac, Linux, ChromeOS): click the install icon at the right end of
     the address bar (a screen with an arrow), then **Install**. Or the ⋮ menu → **Cast, save and
     share** → **Install page as app**.
   - **Safari on a Mac:** **File → Add to Dock**.
   - **iPhone or iPad** (Safari): the **Share** button → **Add to Home Screen**.
   - **Android** (Chrome): the ⋮ menu → **Add to Home screen**, then **Install**.
   - **Firefox:** it runs as a normal page; for an installed app, use one of the browsers above.
3. It now opens from the Dock, Start menu or home screen, in its own window, and works offline.

Its data lives in that browser on that device. Uninstalling it, or clearing the site's data,
removes it.

## Building an app

### Start

```sh
npm run create -- <name> --description "What it does, in one sentence."
```

This copies `template/` to `apps/<name>/`: a working offline app to change into yours. The name is
lowercase with hyphens.

### What an app folder holds

`app/` is the app itself, served as-is at `apps/<name>/app/` on the catalog site:

- `index.html`, linking `manifest.webmanifest` and registering `sw.js`.
- `manifest.webmanifest`: `name`, `short_name`, `start_url` and `scope` (`./`), `display`
  (`standalone`), colours, and icons: `icon.svg`, plus `icon-192.png` and `icon-512.png`, which
  `npm run icons -- <name>` renders from the SVG.
- `sw.js`: keeps the app's files so it opens offline. List every file in `FILES`, and bump
  `VERSION` whenever they change, or people keep the old copy.
- Plain HTML, CSS and JavaScript modules, no build step and no code from other sites. Keep data in
  `localStorage` or IndexedDB, on the device. No accounts, no telemetry.

Next to `app/`: the READMEs, and the tests.

### Tests

Each `*.test.mjs` opens the app in a real Chromium with `openApp(name)` from `test/app.mjs`, served
from localhost. Test what it does, that its data survives a reload, that it opens offline
(`waitForOffline(page)`, then `context.setOffline(true)` and a reload), and that its manifest and
icons are there.

### Before a pull request

```sh
npm run check   # manifest, icons, service worker, no remote code, READMEs, tests, secrets
npm test        # every app in a real browser
```

CI runs both, and the private-data guard, which fails on company hosts, internal IDs and work
email addresses anywhere in the change or its commits. Use `example.com` in examples and tests.

Commit messages are conventional commits scoped to the app: `feat(example): undo`.

### Desktop apps, later

An app that needs more than a browser allows (the file system, the menu bar, running at login)
will be a desktop app. Whether those use Tauri or SwiftUI isn't decided yet; until it is, build
the PWA.

### Site

The catalog site at https://tinwright.github.io/app-lanterns is built by `tinwright.github.io` from a
checkout of this repo, hourly and on demand; nothing here builds or deploys it. Its build copies
each app to `apps/<name>/app/` (`scripts/rules.mjs` `afterBuild`), and the Open button and install
steps come from `scripts/site.mjs`. To see it, run `npm run dev` in `tinwright.github.io`, cloned
next to this repo; its `npm test` checks every page and link.
