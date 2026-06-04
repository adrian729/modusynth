import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', '.prettierrc.cjs'] },
    js.configs.recommended,
    tseslint.configs.recommended,
    react.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/react-in-jsx-scope': 'off',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
            ],
        },
    },
    {
        // CLAUDE.md invariant: the `get*` selectors are hooks (they call
        // useAppSelector internally) despite the `get` prefix — the naming
        // predates this rule. Rules of Hooks still apply at their call sites.
        files: ['src/reducers/*.ts'],
        rules: {
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    eslintConfigPrettier,
);
