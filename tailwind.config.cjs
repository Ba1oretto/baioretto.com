const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ["class", "[data-darkmode-enable=\"true\"]"],
  content: [
    "./index.html",
    "./src/**/*.tsx"
  ],
  theme: {
    colors: {
      blue: {
        200: "hsl(202, 83%, 45%)",
        300: "hsl(225, 77%, 58%)",
      },
      yellow: {
        100: "hsl(51, 100%, 50%)",
        200: "hsl(46, 100%, 50%)",
      },
      amber: {
        100: "hsl(40, 100%, 49%)",
        200: "hsl(38, 90%, 48%)",
        300: "hsl(34, 100%, 50%)",
        400: "hsl(31, 92%, 50%)",
        800: "hsl(23, 82%, 31%)",
        900: "hsl(29, 80%, 20%)",
      },
      orange: {
        100: "hsl(26, 100%, 50%)",
        200: "hsl(22, 100%, 44%)",
      },
      white: colors.white,
      black: {
        DEFAULT: colors.black,
        50: "hsl(220, 14%, 96%)",
        100: "hsl(210, 17%, 82%)",
        750: "hsl(222, 68%, 4%)",
        800: "hsl(223, 64%, 2%)",
      },
      transparent: colors.transparent
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "992px",
      xl: "1100px"
    },
    container: {
      padding: {
        DEFAULT: "15px"
      }
    },
    extend: {
      borderRadius: {
        "2/4": "50%"
      },
      boxShadow: {
        blue: "inset 0 0 0 2px #138cd3"
      },
    },
  },
  plugins: [],
};
