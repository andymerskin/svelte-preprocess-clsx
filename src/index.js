const clsx = require('clsx');
const cheerio = require('cheerio');

function sveltePreprocessClsx(options = {}) {
  const {
    moduleName = 'styles',
    clsxHelper = 'clsx',
    moduleAttribute = '\\:class',
    clsxAttribute = '\\@class',
    modules = true,
    clsx = true
  } = options;

  const transformer = ({ content, filename }) => {
    const template = cheerio.load(content, {
      xmlMode: true,
      decodeEntities: false
    });

    // Handle CSS modules
    if (modules) {
      const attr = `[${moduleAttribute}]`;
      const queryModules = template.find(attr);
      queryModules.each((i, el) => {
        let classes = el.attr(attr).split(' ');
        classes = classes.map(className => `{${moduleName}.className}`);
        el.addClass(classes.join(' '));
        el.removeAttr(attr);
      });
    }

    // Handle CLSX
    if (clsx) {
      const attr = `[${clsxAttribute}]`;
      const queryClsx = template.find(attr);
      queryClsx.each((i, el) => {
        const expression = el.attr(attr);
        const clsxString = `{${clsxHelper}(${expression})}`;
        const className = el.attr('class');
        el.attr('class', `${className} ${clsxString}`);
        el.removeAttr(`${clsxAttribute}`);
      });
    }
  };

  return transformer;
}

module.exports = sveltePreprocessClsx;