module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  importOrderSortSpecifiers: true,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports'), require.resolve('prettier-plugin-tailwindcss')],
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};
