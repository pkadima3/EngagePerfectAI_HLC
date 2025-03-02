module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Turn these errors into warnings
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'warn'
  }
}
