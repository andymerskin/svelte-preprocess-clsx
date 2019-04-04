const svelte = require('svelte');
const sveltePreprocess = require('svelte-preprocess');
const sveltePreprocessClsx = require('../src/index.js');

sveltePreprocessClsx({
  moduleName: 'styles',
  clsxHelper: 'clsx',
  moduleAttribute: '\\:class',
  clsxAttribute: '\\@class',
  modules: true,
  clsx: true
})