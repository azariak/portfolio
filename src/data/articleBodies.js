// Article bodies, keyed by the `slug` field in articles.json.
// Imported raw so the markdown ships as a string and renders via react-markdown.
// Kept out of the `articles/` folder so it can't be confused with articles.json.
import whenContentCostsNothing from './articles/when-content-costs-nothing.md?raw';

export const articleBodies = {
  'when-content-costs-nothing': whenContentCostsNothing,
};
