// The app's state lives in localStorage, so it survives closing the app; the service worker keeps
// the app's files, so it opens without a connection.

const KEY = '__NAME__';
const output = /** @type {HTMLOutputElement} */ (document.querySelector('#count'));

const read = () => Number(localStorage.getItem(KEY) ?? 0);
const show = (/** @type {number} */ count) => {
  output.value = String(count);
  localStorage.setItem(KEY, String(count));
};

document.querySelector('#up')?.addEventListener('click', () => show(read() + 1));
document.querySelector('#down')?.addEventListener('click', () => show(Math.max(0, read() - 1)));
document.querySelector('#reset')?.addEventListener('click', () => show(0));
show(read());

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
