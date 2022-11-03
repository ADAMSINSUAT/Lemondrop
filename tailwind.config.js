/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      primary:{
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
      },
      secondary:{
        neon: '#44D62C',
      }
    },
    extend: {},
  },
  plugins: [],
}
