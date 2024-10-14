module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["plugin:svelte/recommended", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
    extraFileExtensions: [".svelte"], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
