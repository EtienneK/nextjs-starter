module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript'
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  "rules": {
    "jsx-a11y/anchor-is-valid": "off"
  }
};
