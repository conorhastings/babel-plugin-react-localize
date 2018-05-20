const t = require('babel-types');
const formatter = require('react-localize/build/util/localize-formatter');

module.exports = function replace() {
  const visitor = {
    CallExpression(path, state) {
      if (path.node.callee.name === 'localize') {
        const argumentsLength = path.node.arguments.length;
        const key = path.node.arguments[0].value;
        const replaceArray = (path.node.arguments[1] || []).map(node => node.value);
        path.replaceWith(t.stringLiteral(formatter(state.opts.localizationBundle[key], key, replaceArray)));
      }
    }
  };
  return { visitor };
};
