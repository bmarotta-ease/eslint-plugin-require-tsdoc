/**
 * @fileoverview Ensures that all typescript exported types and classes have TSDoc comments
 * @author Bruno Marotta
 */
"use strict";

const {
  getJSDocComment
} = require('@es-joy/jsdoccomment');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensures that all typescript exported types and classes have TSDoc comments",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      "no-tsdoc": "Missing TSDoc for {{typeName}} {{name}}",
    },
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Checks if a particular entity is exported
     * @param {Node} node 
     */
    function isExported(node) {
      const sourceCode = context.getSourceCode(node);
      let before = sourceCode.getTokenBefore(sourceCode.getFirstToken(node));
      while (before && before.type == "Keyword") {
        if (before.value == "export") {
          return true;
        }
        before = sourceCode.getTokenBefore(before);
      }
      return before;
    }

    function checkType(node, typeName) {
      if (isExported(node)) {
        let comment = getJSDocComment(context.getSourceCode(node), node, { minLines: 0, maxLines: 1 });
        if (!comment) {
          context.report({
            node,
            messageId: "no-tsdoc",
            data: {
              typeName: typeName,
              name: node.id && node.id.name || '<anonymous>',
            },
          });
        }
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // Basic types
      ClassDeclaration: (node) => checkType(node, "class"),
      ClassExpression: (node) => checkType(node, "class"),
      ObjectExpression: (node) => checkType(node, "object"),
      ArrowFunctionExpression: (node) => checkType(node, "arroy function"),
      FunctionDeclaration: (node) => checkType(node, "function"),
      FunctionExpression: (node) => checkType(node, "function"),

      // TS Types
      'TSFunctionType': (node) => checkType(node, "type"),
      'TSInterfaceDeclaration': (node) => checkType(node, "interface"),
      'TSTypeAliasDeclaration': (node) => checkType(node, "type"),
      'TSEnumDeclaration': (node) => checkType(node, "enum"),
      'TSDeclareFunction': (node) => checkType(node, "function"),
    };
  },
};
