module.exports = {
  extends: 'next',
  rules: {
    // Temporarily disable some rules during development
    '@typescript-eslint/no-unused-vars': 'warn', // Downgrade from error to warning
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'warn',
  },
};
