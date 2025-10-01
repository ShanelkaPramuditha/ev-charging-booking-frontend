import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
	{
		ignores: [
			'dist',
			'node_modules',
			'*.config.js',
			'*.config.ts',
			'routeTree.gen.ts',
		],
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				React: 'readonly',
			},
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		settings: {
			react: {
				version: '19.1',
				runtime: 'automatic',
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@typescript-eslint': tseslint,
			react,
			prettier,
			'simple-import-sort': simpleImportSort,
			import: eslintPluginImport,
		},
		rules: {
			...js.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			...configPrettier.rules,

			// ✅ Prettier formatting
			'prettier/prettier': 'error',

			// ✅ Import sorting rules
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'import/no-duplicates': 'error',

			// ✅ TypeScript rules
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// ✅ React rules
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/no-unescaped-entities': 'warn',

			// ✅ Disable redundant rules
			'no-undef': 'off', // TypeScript handles this
		},
	},
	{
		// Specific rules for UI components and context files
		files: ['**/components/ui/**/*.{js,jsx,ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
];
