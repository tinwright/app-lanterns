#!/usr/bin/env node
// npm run icons -- <name>: renders apps/<name>/app/icon.svg to the PNG icons that installing an
// app needs (192 and 512 pixels), in a real Chromium. Run it again after changing the SVG.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ITEMS_DIR } from './workshop.mjs';

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run icons -- <name>');
  process.exit(2);
}
const appDir = path.join(ITEMS_DIR, name, 'app');
const svg = fs.readFileSync(path.join(appDir, 'icon.svg'), 'utf8');
const browser = await chromium.launch();
for (const size of [192, 512]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  await page.screenshot({ path: path.join(appDir, `icon-${size}.png`), omitBackground: true });
  await page.close();
}
await browser.close();
console.log(`Wrote icon-192.png and icon-512.png in ${path.relative(process.cwd(), appDir)}.`);
