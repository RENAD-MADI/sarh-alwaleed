import globals from 'globals';

/** Lint config for the browser-side scripts in frontend/js. */
export default [
  {
    files: ['frontend/js/**/*.js'],
    ignores: [
      'frontend/js/jquery-3.7.1.min.js',
      'frontend/js/bootstrap.bundle.min.js',
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Loaded from CDN or by an earlier <script> tag on the page.
        axios: 'readonly',
        API: 'readonly',
        AppUtils: 'readonly',
        DashboardCore: 'readonly',
        ContractSubmit: 'readonly',
        WOW: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
      },
    },
    rules: {
      // `storeData`, `sendMessage` and `scrollToTop` are invoked from inline
      // onclick attributes in the HTML, which ESLint cannot see.
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(storeData|sendMessage|scrollToTop|scrollFunction)$',
        },
      ],
      'no-undef': 'error',
      'no-var': 'off',
      eqeqeq: ['error', 'smart'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
  {
    ignores: ['node_modules/**', 'backend/**', 'frontend/css/**', 'frontend/webfonts/**'],
  },
];
