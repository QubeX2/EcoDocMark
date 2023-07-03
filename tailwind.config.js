/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

module.exports = {
  content: [
    "./packages/renderer/index.html",
    "./packages/**/*.{html,js,jsx,ts,tsx}",
    "./modules/**/*.{html,js,jsx,ts,tsx}",
  ],
  darkMode: true,
  theme: {
    extend: {
      colors: {
         transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        red: colors.red,
        blue: colors.blue,
        green: colors.green,
        orange: colors.orange,
      }
    },
  },
  plugins: [],
}

