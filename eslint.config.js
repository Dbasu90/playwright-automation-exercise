// eslint.config.js
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser,
    },
    plugins: {
      "@typescript-eslint": plugin,
      playwright,
    },
    rules: {
      // ESLint recommended rules
      ...plugin.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
      ...prettier.rules,
    },
  },
];
