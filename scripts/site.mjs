// This workshop's part of the tinwright site, which tinwright.github.io builds from a checkout of
// this repo: its nouns, its own words, and what its pages add to the shell there. Each hook gets
// the site, the tool, where the page sits (ctx) and the site's helpers (kit), and returns HTML;
// escape anything that comes from the repo with kit.escapeHTML().

/**
 * @typedef {import('./items.mjs').Item} Item
 * @typedef {import('./items.mjs').SiteConfig} Site
 * @typedef {{ lang: string, root: string, home: string }} Ctx
 * @typedef {{
 *   escapeHTML: (text: string) => string,
 *   commandHTML: (lang: string, command: string) => string,
 *   itemsPath: (site: Site) => string,
 * }} Kit
 */

/** The nouns on this workshop's pages, per language. */
export const nouns = {
  en: {
    item: 'App',
    allItems: 'All apps',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'app' : 'apps'}`,
    emptyTitle: 'No apps yet',
    emptyText: 'The first ones are on their way. Watch the repository on GitHub to hear when they land.',
    back: '← All apps',
    moreItems: 'More apps',
  },
  fr: {
    item: 'Appli',
    allItems: 'Toutes les applis',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'appli' : 'applis'}`,
    emptyTitle: 'Pas encore d’applis',
    emptyText: 'Les premières arrivent bientôt. Suivez le dépôt sur GitHub pour savoir quand elles seront là.',
    back: '← Toutes les applis',
    moreItems: 'Autres applis',
  },
  es: {
    item: 'App',
    allItems: 'Todas las apps',
    count: (/** @type {number} */ n) => `${n} ${n === 1 ? 'app' : 'apps'}`,
    emptyTitle: 'Todavía no hay apps',
    emptyText: 'Las primeras están en camino. Sigue el repositorio en GitHub para enterarte cuando lleguen.',
    back: '← Todas las apps',
    moreItems: 'Más apps',
  },
};

/** This workshop's own words, per language. */
const WORDS = {
  en: {
    offline: 'Offline',
    yes: 'Works offline',
    open: 'Open the app',
    install: 'To keep it, install it from your browser:',
    steps: [
      '<strong>Chrome or Edge:</strong> the install icon at the end of the address bar.',
      '<strong>Safari on a Mac:</strong> File → Add to Dock.',
      '<strong>iPhone or iPad:</strong> Share → Add to Home Screen.',
      '<strong>Android:</strong> the ⋮ menu → Add to Home screen.',
    ],
  },
  fr: {
    offline: 'Hors ligne',
    yes: 'Fonctionne hors ligne',
    open: 'Ouvrir l’appli',
    install: 'Pour la garder, installez-la depuis votre navigateur :',
    steps: [
      '<strong>Chrome ou Edge :</strong> l’icône d’installation au bout de la barre d’adresse.',
      '<strong>Safari sur Mac :</strong> Fichier → Ajouter au Dock.',
      '<strong>iPhone ou iPad :</strong> Partager → Sur l’écran d’accueil.',
      '<strong>Android :</strong> le menu ⋮ → Ajouter à l’écran d’accueil.',
    ],
  },
  es: {
    offline: 'Sin conexión',
    yes: 'Funciona sin conexión',
    open: 'Abrir la app',
    install: 'Para conservarla, instálala desde tu navegador:',
    steps: [
      '<strong>Chrome o Edge:</strong> el icono de instalar al final de la barra de direcciones.',
      '<strong>Safari en Mac:</strong> Archivo → Añadir al Dock.',
      '<strong>iPhone o iPad:</strong> Compartir → Añadir a pantalla de inicio.',
      '<strong>Android:</strong> el menú ⋮ → Añadir a la pantalla de inicio.',
    ],
  },
};
/** @param {string} lang */
const wordsOf = (lang) => WORDS[/** @type {keyof typeof WORDS} */ (lang)] ?? WORDS.en;

/** Where the site hosts an app, from the site's root. @param {Site} site @param {Item} item @param {Kit} kit */
const appHref = (site, item, kit) => `${kit.itemsPath(site)}/${encodeURIComponent(item.name)}/app/`;

/**
 * @param {Site} site
 * @param {Item} item
 * @param {Ctx} ctx
 * @param {Kit} kit
 */
export function facts(site, item, ctx, kit) {
  const words = wordsOf(ctx.lang);
  return item.hasApp ? `<dt>${words.offline}</dt><dd>${words.yes}</dd>` : '';
}

/**
 * Open the app, which the site hosts, then install it from the browser.
 * @param {Site} site
 * @param {Item} item
 * @param {Ctx} ctx
 * @param {Kit} kit
 */
export function install(site, item, ctx, kit) {
  if (!item.hasApp) return '';
  const words = wordsOf(ctx.lang);
  return `<div class="install">
              <p><a class="button" href="${ctx.root}${appHref(site, item, kit)}">${words.open}</a></p>
              <p>${words.install}</p>
              <ul class="steps">${words.steps.map((step) => `<li>${step}</li>`).join('')}</ul>
            </div>`;
}
