module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'react-hooks'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': 'off', // Optional: disable if you don't want to wrap all text in <Text>
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.config.js',
    '.eslintrc.js',
    'jest.setup.js'
  ],
};