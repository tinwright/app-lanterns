// This workshop's rules for npm run check, and its build step: each app's app/ folder is copied
// onto the site, next to its page, so the catalog site is also where the app runs from.

import fs from 'node:fs';
import path from 'node:path';
import config from '../site.config.js';

/** Code fetched from elsewhere and run: an app here works offline, from its own files. */
const REMOTE_CODE = [/<script[^>]+src=["']https?:/i, /import\(\s*["']https?:/, /\beval\(/, /new Function\(/];

export default {
  /**
   * @param {import('./items.mjs').Item} item
   * @param {string[]} files
   */
  check(item, files) {
    const has = (/** @type {string} */ file) => files.includes(path.join('app', file));
    if (!has('index.html')) return ['no app/index.html'];
    /** @type {string[]} */
    const problems = [];
    const read = (/** @type {string} */ file) => fs.readFileSync(path.join(item.dir, 'app', file), 'utf8');

    if (!has('manifest.webmanifest')) problems.push('no app/manifest.webmanifest');
    else {
      const manifest = JSON.parse(read('manifest.webmanifest'));
      for (const field of ['name', 'short_name', 'start_url', 'display'])
        if (!manifest[field]) problems.push(`the web manifest needs "${field}"`);
      for (const size of ['192x192', '512x512']) {
        const icon = manifest.icons?.find((/** @type {any} */ one) => one.sizes === size && one.type === 'image/png');
        if (!icon) problems.push(`the web manifest needs a ${size} PNG icon (npm run icons -- ${item.name})`);
        else if (!has(icon.src)) problems.push(`app/${icon.src} is missing (npm run icons -- ${item.name})`);
      }
    }
    if (!/<link[^>]+rel="manifest"/.test(read('index.html'))) problems.push('index.html should link the web manifest');
    if (!has('sw.js')) problems.push('no app/sw.js: a service worker is what makes it work offline');

    for (const file of files.filter((one) => one.startsWith('app') && /\.(m?js|html)$/.test(one)))
      if (REMOTE_CODE.some((pattern) => pattern.test(fs.readFileSync(path.join(item.dir, file), 'utf8'))))
        problems.push(`${file} runs code from elsewhere (remote script, eval or new Function)`);
    return problems;
  },

  /**
   * Copies each app to apps/<name>/app/ on the site.
   * @param {{ outDir: string, items: import('./items.mjs').Item[] }} build
   */
  afterBuild({ outDir, items }) {
    for (const item of items) {
      const from = path.join(item.dir, 'app');
      if (fs.existsSync(from)) fs.cpSync(from, path.join(outDir, config.itemsDir, item.name, 'app'), { recursive: true });
    }
  },
};
