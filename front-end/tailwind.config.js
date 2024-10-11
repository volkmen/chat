/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/components/**/*.{html,js,tsx, jsx}', './src/pages/**/*.{html,js,tsx, jsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans]
      }
    }
  },

  plugins: [require('@tailwindcss/forms')]
};
