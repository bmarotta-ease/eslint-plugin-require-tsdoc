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

    let defaultExport = undefined;


    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Checks if the given node is the default export
     * @param {Node} node 
     * @returns True if the node is the module default export
     */
    function isDefaultExport(node) {
      return (defaultExport && node.id && node.id.name && defaultExport.value === node.id.name);
    }

    /**
     * Checks if a particular entity is exported
     * @param {Node} node 
     */
    function isExported(node) {
      if (isDefaultExport(node)) {
        return true;
      }

      // Check if we find the keyword export before the type declaration
      const sourceCode = context.getSourceCode(node);
      let before = sourceCode.getTokenBefore(sourceCode.getFirstToken(node));
      while (before && before.type == "Keyword") {
        if (before.value == "export") {
          return true;
        }
        before = sourceCode.getTokenBefore(before);
      }
      return false;
    }

    /**
     * Checks if the given node has a TSDoc comment
     * @param {Node} node The node to check
     * @param {String} typeName The type name for logging
     */
    function checkIfNodeHasTSDocComment(node, typeName, name) {
      let comment = getJSDocComment(context.getSourceCode(node), node, { minLines: 0, maxLines: 1 });
      if (!comment) {
        context.report({
          node,
          messageId: "no-tsdoc",
          data: {
            typeName: typeName,
            name: name || (node.id && node.id.name) || '<anonymous>',
          },
        });
      }
    }

    /**
     * Checks if the given need needs and has TSDoc comments
     * @param {Node} node The node to check
     * @param {String} typeName The typename for logging
     */
    function checkType(node, typeName) {
      if (isExported(node)) {
        checkIfNodeHasTSDocComment(node, typeName);
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
      VariableDeclarator: (node) => {
        // Check only global variables which are default export
        if (node.parent && node.parent.parent && node.parent.parent.type === "Program" && isDefaultExport(node)) {
          checkIfNodeHasTSDocComment(node.parent, "variable", node.id.name);
        }
      },

      // TS Types
      'TSFunctionType': (node) => checkType(node, "type"),
      'TSInterfaceDeclaration': (node) => checkType(node, "interface"),
      'TSTypeAliasDeclaration': (node) => checkType(node, "type"),
      'TSEnumDeclaration': (node) => checkType(node, "enum"),
      'TSDeclareFunction': (node) => checkType(node, "function"),

      // Default export
      Program: (node) => {
        const sourceCode = context.getSourceCode(node);
        const defaultExportNode = node.body.find(n => n.type == "ExportDefaultDeclaration");        
        if (!defaultExportNode) {
          defaultExport = undefined;
        } else {
          const tokens = sourceCode.getTokens(defaultExportNode);
          defaultExport = tokens.find(n => n.type == "Identifier");
        }
        
      }
    };
  },
};
