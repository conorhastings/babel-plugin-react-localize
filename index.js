const formatter = require("react-localize/build/util/localize-formatter");

module.exports = function(babel) {
  const { types: t } = babel;
  const jsxVisitor = {
    JSXElement(path, state) {
      const node = path.node.openingElement;
      if (node.name.name === "Text") {
        const message = node.attributes.find(
          attr => attr.name.name === "message"
        );
        const values = node.attributes.find(
          attr => attr.name.name === "values"
        );
        const replaceArray = (values || []).value.expression.elements.map(el => el.value);
        const key = message.value.value;
        const replaceString = formatter(
          state.opts.localizationBundle[key],
          key,
          replaceArray
        );
        const remainingProps = node.attributes.filter(
          attr => attr.name.name !== "message" && attr.name.name !== "values"
        );
        path.replaceWith(
          t.jSXElement(
            t.jSXOpeningElement(t.jSXIdentifier("span"), remainingProps, false),
            t.jSXClosingElement(t.jSXIdentifier("span")),
            [t.jSXText(replaceString)]
          )
        );
      }
    }
  };
  
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.name === "localize") {
          const argumentsLength = path.node.arguments.length;
          const key = path.node.arguments[0].value;
          const replaceArray = (path.node.arguments[1] || []).map(
            node => node.value
          );
          path.replaceWith(
            t.stringLiteral(
              formatter(state.opts.localizationBundle[key], key, replaceArray)
            )
          );
        }
      },
      ImportDeclaration(path, state) {
        if (
          path.node.specifiers &&
          path.node.specifiers.find(spec => spec.imported.name === "Text") &&
          path.node.source &&
          path.node.source.value === "react-localize"
        ) {
          path.getFunctionParent().traverse(jsxVisitor, state);
          path.remove();
        }
      }
    }
  };
}
