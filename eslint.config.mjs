// Node.js のESMモジュールで __dirname を使えるようにする
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// ★ 追加：ESLint v9 で必要
import js from '@eslint/js';

// 旧 .eslintrc スタイルの拡張設定（extends）を FlatConfig でも使えるようにする互換モード
import { FlatCompat } from '@eslint/eslintrc';

// プラグイン読み込み（それぞれのルールを提供するモジュール）
import eslintPluginImport from 'eslint-plugin-import';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginNext from '@next/eslint-plugin-next';

// __dirname を ESM で使うための変数定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat の初期化（extends 互換用）
// ★ 変更点：recommendedConfig を必ず渡す（v9で必須）
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// 設定本体の配列（Flat Configでは export default に直接配列を返す）
const eslintConfig = [
  // Next.js + TypeScript + Prettier の旧形式ルールを適用（互換）
  ...compat.extends('next/core-web-vitals'),
  eslintConfigPrettier,
  eslintPluginPerfectionist.configs['recommended-natural'],

  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
      },
      globals: {
        window: true,
        document: true,
      },
    },
    plugins: {
      react: eslintPluginReact,
      'unused-imports': eslintPluginUnusedImports,
      import: eslintPluginImport,
      '@typescript-eslint': tsEslintPlugin,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
      sonarjs: eslintPluginSonarjs,
      unicorn: eslintPluginUnicorn,
      next: eslintPluginNext,
    },
    rules: {
      // React
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'ignore' },
      ],
      'react/jsx-boolean-value': 'error',
      'react/self-closing-comp': ['error', { component: true, html: true }],

      // import関連（perfectionistを採用 / simple-import-sortは無効）
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-object-types': 'error',
      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-jsx-props': 'error',
      'perfectionist/sort-modules': 'error',

      // 未使用
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TS許容
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // 命名
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],

      // a11y
      'jsx-a11y/alt-text': 'warn',

      // Quality
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',

      // Modern JS
      'unicorn/prefer-optional-catch-binding': 'warn',

      // Next.js
      '@next/next/no-img-element': 'off',
      '@next/next/no-css-tags': 'error',
      '@next/next/inline-script-id': 'error',
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: { window: false, document: false },
    },
    rules: { 'no-console': 'off' },
  },
];

export default eslintConfig;
