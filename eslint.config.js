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
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
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
        projectService: true,
        extraFileExtensions: [".svelte"],
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
      // Disable for external links (this is a static site with no SvelteKit routing)
      "svelte/no-navigation-without-resolve": "off",
      "@typescript-eslint/no-floating-promises": "error",
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
