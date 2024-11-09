/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
  ],
  languageOptions: {
    parser: "@babel/eslint-parser"
  },
  plugins: ['@typescript-eslint'],
  root: true,
};
