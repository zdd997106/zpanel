import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tsEslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: dirname(__filename),
});

export default tsEslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  extends: [
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    eslintPluginPrettierRecommended,
  ],
  languageOptions: {
    parser: tsEslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
  },
});
