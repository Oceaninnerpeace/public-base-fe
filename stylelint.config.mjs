/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-vue',
    'stylelint-config-recess-order',
  ],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'config',
          'theme',
          'import',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['src/styles/tailwind.css'],
      customSyntax: 'postcss',
    },
  ],
};
