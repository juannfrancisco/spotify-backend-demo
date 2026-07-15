// stylelint.config.js
module.exports = {
  extends: [
    'stylelint-config-standard',       // Reglas estándar de Stylelint
    'stylelint-config-tailwindcss',    // Soporte para TailwindCSS
  ],
  plugins: [],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'variants',
          'responsive',
          'screen',
          'plugin',
          'theme',
          'custom-variant',
          'utility',
          'config',
          'import-glob',
          'reference', // Para imports de Tailwind
        ],
      },
    ],
    // Permitir archivos CSS vacíos (componentes que solo usan Tailwind)
    'no-empty-source': null,
    // Permitir patrones de nombres personalizados para Tailwind CSS
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    // Permitir media queries modernas de Tailwind CSS v4
    'media-query-no-invalid': null,
    // Permitir valores deprecated que aún son necesarios
    'declaration-property-value-keyword-no-deprecated': null,
  },
};
