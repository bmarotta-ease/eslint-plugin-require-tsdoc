# Ensures that all typescript exported types and classes have TSDoc comments (`tsdoc-require/require`)

<!-- end auto-generated rule header -->

This rule extends the official Microsoft eslint-plugin-tsdoc plugin which checks the validity of [TSDoc|https://tsdoc.org] comments. The original plugin doesn't check if TSDoc comments are existing, only if they are valid. A typescript module with no TSDoc comments at all is therefore valid for the Microsoft plugin. This plugin aims to fix this problem.

## Rule Details

This rules ensure that Typescript exported **functions**, **types**, **interfaces**, **enums** and **classes** are annotated with [TSDoc|https://tsdoc.org] comments. 

Examples of **incorrect** code for this rule:

```ts

export MyClass {}

// This is my class
export MyClass{}

```

Examples of **correct** code for this rule:

```ts

/** This is my class */
export MyClass{}

```

## When Not To Use It

Use it when you want to enforce that developer write valid TSDoc comments for all exported entities

## Further Reading

For the full TSDoc documentation, please check https://tsdoc.org
