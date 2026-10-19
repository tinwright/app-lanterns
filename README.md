# app-lanterns

Small apps that work offline, on any device. Part of [tinwright](https://github.com/tinwright).

| App | What it does |
|---|---|
| [**example**](apps/example) | A tally counter that works offline. |

## Install

Open an app from its page on the [catalog site](https://tinwright.github.io/app-lanterns), which
hosts them. To keep one, install it from your browser: the install icon in Chrome or Edge's address
bar, **File → Add to Dock** in Safari on a Mac, or **Add to Home Screen** on a phone. No store, no
account, and an app's data stays on your device.

The apps here start as progressive web apps (PWAs). Apps that need more of the computer than a
browser allows will come as desktop apps later.

## Make one

```sh
npm install
npx playwright install chromium   # once, for the tests and icons
npm run create -- my-app --description "What it does, in one sentence."
npm run icons -- my-app           # after changing app/icon.svg
npm run check   # this workshop's rules (manifest, icons, service worker) and a scan for secrets
npm test        # every app in a real browser, offline included
```

[`CLAUDE.md`](CLAUDE.md) is the full guide, written so Claude can follow it too.

## Licence

[MIT](LICENSE)
