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
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  env: {
    browser: true,
    node: true,
  },
};
