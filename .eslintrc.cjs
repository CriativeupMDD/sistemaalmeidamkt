module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "next-env.d.ts",
    "*_php_backup/",
    "**/*_php_backup/**"
  ]
};
