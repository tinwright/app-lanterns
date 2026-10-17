// Opens an app the way a visitor would: served over http from localhost (service workers need a
// secure origin, which localhost counts as), in a real Chromium through Playwright.

import path from 'node:path';
import { chromium } from 'playwright';
import { serve } from '../scripts/serve.mjs';
import { ITEMS_DIR } from '../scripts/workshop.mjs';

/**
 * @param {string} name the app's folder under apps/
 * @returns {Promise<{ page: import('playwright').Page, context: import('playwright').BrowserContext, url: string, close: () => Promise<void> }>}
 */
export async function openApp(name) {
  const server = await serve(path.join(ITEMS_DIR, name, 'app'));
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(server.url);
  return {
    page,
    context,
    url: server.url,
    close: async () => {
      await browser.close();
      await server.close();
    },
  };
}

/** Waits until the page's service worker is active and controls the page. @param {import('playwright').Page} page */
export async function waitForOffline(page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))) {
    await page.reload();
    await page.evaluate(() => navigator.serviceWorker.ready);
  }
}
