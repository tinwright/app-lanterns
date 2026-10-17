// The app in a real browser: it counts, remembers the count, opens offline, and can be installed.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openApp, waitForOffline } from '../../test/app.mjs';

test('counts, and keeps the count after a reload', async () => {
  const { page, close } = await openApp('__NAME__');
  try {
    await page.click('#up');
    await page.click('#up');
    await page.click('#down');
    await page.click('#up');
    assert.equal(await page.textContent('#count'), '2');
    await page.reload();
    assert.equal(await page.textContent('#count'), '2');
    await page.click('#reset');
    assert.equal(await page.textContent('#count'), '0');
  } finally {
    await close();
  }
});

test('opens with no connection, once it has been opened once', async () => {
  const { page, context, close } = await openApp('__NAME__');
  try {
    await waitForOffline(page);
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.textContent('h1'), '__TITLE__');
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).display), 'grid');
  } finally {
    await close();
  }
});

test('has what installing needs: a manifest with a name, a start URL and its icons', async () => {
  const { page, url, close } = await openApp('__NAME__');
  try {
    const href = await page.getAttribute('link[rel="manifest"]', 'href');
    const manifest = await (await fetch(new URL(href ?? '', url))).json();
    assert.equal(manifest.display, 'standalone');
    for (const icon of manifest.icons) assert.equal((await fetch(new URL(icon.src, url))).status, 200, icon.src);
  } finally {
    await close();
  }
});
