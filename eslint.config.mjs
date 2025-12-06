import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    name: 'custom-typescript-overrides',
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    name: 'custom-javascript-overrides',
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    name: 'custom-react-overrides',
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;
