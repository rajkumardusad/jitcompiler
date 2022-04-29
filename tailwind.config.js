const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./views/**/*.{hbs,html,js}",
    "./public/js/**/*.{html,js}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      animation: {
        'spin-slow': 'spin 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}
