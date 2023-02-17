# eslint-plugin-tsdoc-require

Ensures that all typescript exported types and classes have TSDoc comments

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-tsdoc-require`:

```sh
npm install eslint-plugin-tsdoc-require --save-dev
```

## Usage

Add `tsdoc-require` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "tsdoc-require"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "tsdoc-require/require": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                             | Description                                                                |
| :------------------------------- | :------------------------------------------------------------------------- |
| [require](docs/rules/require.md) | Ensures that all typescript exported types and classes have TSDoc comments |

<!-- end auto-generated rules list -->


