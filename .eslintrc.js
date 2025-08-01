module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    'prefer-const': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
}