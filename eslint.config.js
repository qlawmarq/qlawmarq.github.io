import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      globals: {
        svelteHTML: "readonly",
        $$Generic: "readonly",
      },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Svelte uses $$Props for type augmentation
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^\\$\\$(Props|Events|Slots)$",
        },
      ],
      // Allow empty interface extending svelteHTML attributes
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    ignores: [
      ".DS_Store",
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "package/**",
      ".env",
      ".env.*",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "**/*.cjs",
    ],
  },
];
