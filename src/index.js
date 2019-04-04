const $ = require('cheerio');
const cssesc = require('cssesc');
const clsx = require('clsx/dist/clsx.js');

const cssescOpts = {
  isIdentifier: true
};

function sveltePreprocessClsx(options = {}) {
  const {
    moduleName = 'styles',
    clsxHelper = 'clsxHelper',
    moduleAttribute = ':class',
    clsxAttribute = '@class',
    modules = true,
    clsx = true
  } = options;

  const transformer = ({ content }) => {
    const template = $.load(content, {
      xmlMode: true,
      decodeEntities: false
    });

    // Handle CSS modules
    if (modules) {
      const escapedSelector = cssesc(moduleAttribute, cssescOpts);
      const queryModules = template(`[${escapedSelector}]`);
      queryModules.each((i, el) => {
        const $el = $(el);
        let classes = $el.attr(moduleAttribute).split(' ');
        classes = classes.map(className => `{${moduleName}.${className}}`);
        $el.addClass(classes.join(' '));
        $el.removeAttr(moduleAttribute);
      });
    }

    // Handle CLSX
    if (clsx) {
      const escapedSelector = cssesc(clsxAttribute, cssescOpts);
      const queryClsx = template(`[${escapedSelector}]`);
      queryClsx.each((i, el) => {
        const $el = $(el);
        const expression = $el.attr(clsxAttribute);
        const clsxString = `{${clsxHelper}(${expression},${modules ? moduleName : false})}`;
        $el.addClass(clsxString);
        $el.removeAttr(clsxAttribute);
      });
    }    

    return {
      code: template.html()
    }
  };

  return transformer;
}

function clsxHelper(expression, moduleName) { 
  if (moduleName) {
    const classNames = clsx(expression);
    return classNames
      .split(' ')
      .map(className => moduleName[className])
      .join(' ');
  }
  return clsx(expression);
}

module.exports = {
  sveltePreprocessClsx,
  clsxHelper
};