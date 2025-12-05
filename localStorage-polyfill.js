// Polyfill localStorage for Node.js
if (typeof globalThis.localStorage === 'undefined') {
  const { LocalStorage } = require('node-localstorage');
  globalThis.localStorage = new LocalStorage('./.localstorage');
}
