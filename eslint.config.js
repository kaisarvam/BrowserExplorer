import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', 'node_modules'] },
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			reactHooks.configs.flat['recommended-latest'],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2023,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
	{
		// Declaration files need two things ordinary modules do not. Augmenting a library interface,
		// such as styled-components DefaultTheme, requires an interface that extends without adding
		// members. Referring to a module's type from an ambient declaration requires an `import()`
		// annotation, because a top-level import would turn the file into a module and the global
		// types would stop being global.
		files: ['**/*.d.ts', 'src/styled-components.ts'],
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
		},
	},
	{
		files: ['**/*.js'],
		extends: [js.configs.recommended],
		languageOptions: { globals: globals.node },
	},
	prettier
);
