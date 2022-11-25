module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // 'react-app', // error: ESLint couldn't determine the plugin "@typescript-eslint" uniquely.
    'react-app/jest',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'testing-library/no-render-in-setup': 'off',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
}
