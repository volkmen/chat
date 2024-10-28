/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
const flowbite = require('flowbite-react/tailwind');

module.exports = {
  content: [
    './src/components/**/*.{html,js,tsx, jsx}',
    './src/pages/**/*.{html,js,tsx, jsx}',
    './public/index.html',
    flowbite.content()
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  darkMode: 'class',

  plugins: [require('@tailwindcss/forms'), flowbite.plugin()]
};
