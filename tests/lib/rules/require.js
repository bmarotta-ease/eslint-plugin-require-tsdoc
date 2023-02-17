/**
 * @fileoverview Ensures that all typescript exported types and classes have TSDoc comments
 * @author Bruno Marotta
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
});
ruleTester.run("require", rule, {
  valid: [
    // A valid type declaration
    `
    /**
     * This is my type
     */
    export type MyType = {
      a: number;
      b: string;
    }
     `,

    // A valid type without export
    `type MyType = {a: number;b: string;}`,

    // A valid enum declaration
    `
    /** This is my enum */
    export enum MyEnum { A, B, C }
    `,

    // A valid enum without export
    `enum MyEnum { A, B, C }`,

    // A valid interface declaration
    `
    /**
     * This is my interface
     */
    export interface Interface {
      a: number;
      b: string;
    }
     `,

    // A valid interface without export
    `interface Interface {a: number;b: string;}`,

    // A valid pattern with a class and members
    `
import { MyModules } from "my-module";

/** This is my class */
export class MyClass { 

  private _member: string; 

  /**
    My public member
  */
  member: string;
}`,

    // Another valid pattern using line breaks
    `
/** 
 * This is my class with line breaks in comments
 */
export class MyClassWithLineBreakInComments { }`,

    // A non-exported class doesn't need TSDoc
    "class NonExportedClassIsOk{}",

    // Exported function
    `/** This is my function */
export function thisIsMyFunction() { 
  return false;
}`,

    // Non-exported function
    `// No need for TSDoc
function nonExportedFunction() { 
  return false;
}`,
  ],

  invalid: [
    {
      code: `// This is my class
export class MyClass {}`,
      errors: [
        {
          message: "Missing TSDoc for class MyClass",
          type: "ClassDeclaration",
        },
      ],
    },
    {
      code: `/* This is my class */

        export class MyClass {}`,
      errors: [
        {
          message: "Missing TSDoc for class MyClass",
          type: "ClassDeclaration",
        },
      ],
    },
    {
      code: `// This should be a TSDoc
        export function nonExportedFunction() { 
          return false;
        }`,
      errors: [
        {
          message: "Missing TSDoc for function nonExportedFunction",
          type: "FunctionDeclaration",
        },
      ],
    },

    // Invalid as the TSDoc is only in the public member
    {
      code: `
      export class MyClass { 
        /**
         * My public member
         */
        member: string;
      }`,
      errors: [
        {
          message: "Missing TSDoc for class MyClass",
          type: "ClassDeclaration",
        },
      ],
    },

    // Exported interface without TSDOC
    {
      code: "export interface MyInterface { a: number; b: string; }",
      errors: [
        {
          message: "Missing TSDoc for interface MyInterface",
          type: "TSInterfaceDeclaration",
        },
      ],
    },

    // Async function without TSDOC
    {
      code: "export async function myAsyncFuntion() { return new Promise(); }",
      errors: [
        {
          message: "Missing TSDoc for function myAsyncFuntion",
          type: "FunctionDeclaration",
        },
      ],
    },

    // Exported type without TSDOC
    {
      code: "export type MyType = { a: number; b: string; }",
      errors: [
        {
          message: "Missing TSDoc for type MyType",
          type: "TSTypeAliasDeclaration",
        },
      ],
    },

    // Exported enum without TSDOC
    {
      code: "export enum MyEnum { A, B }",
      errors: [
        {
          message: "Missing TSDoc for enum MyEnum",
          type: "TSEnumDeclaration",
        },
      ],
    },
  ],
});
