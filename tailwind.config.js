/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    maxWidth: {
      '4/5': '80%',
    },
    extend: {},
  },
  plugins: [require('daisyui')],
};
