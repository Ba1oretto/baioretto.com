import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: [ "class" ],
  content: [
    "./app/**/*.tsx",
  ],
  theme: {
    colors: {
      cyan: {
        500: "hsl(202, 83%, 45%)",
      },
      blue: {
        100: "hsl(220 100% 60%)",
        200: "hsl(220 100% 54%)",
        250: "hsl(220 100% 50%)",
        300: "hsl(220 100% 48%)",
        400: "hsl(220 100% 42%)",
        500: "hsl(220 100% 36%)",
        600: "hsl(220 100% 30%)",
        700: "hsl(220 100% 24%)",
        800: "hsl(220 100% 18%)",
        900: "hsl(220 100% 12%)",
        950: "hsl(220 50% 12%)",
        1000: "hsl(220 100% 6%)",
        1050: "hsl(223,70%,4%)",
        1100: "hsl(223,70%,2%)",
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
        500: "hsl(28, 92%, 50%)",
        800: "hsl(23, 82%, 31%)",
        900: "hsl(29, 80%, 20%)",
      },
      orange: {
        100: "hsl(26, 100%, 50%)",
        200: "hsl(22, 100%, 44%)",
      },
      white: {
        DEFAULT: colors.white,
        100: "hsl(0 0% 96%)",
        200: "hsl(0 0% 92%)",
        300: "hsl(0 0% 88%)",
        400: "hsl(0 0% 84%)",
        500: "hsl(0 0% 80%)",
        600: "hsl(0 0% 76%)",
        700: "hsl(0 0% 72%)",
        800: "hsl(0 0% 68%)",
        900: "hsl(0 0% 64%)",
      },
      black: {
        DEFAULT: colors.black,
        100: "hsl(0 0% 1%)",
        200: "hsl(0 0% 2%)",
        300: "hsl(0 0% 3%)",
        400: "hsl(0 0% 4%)",
        500: "hsl(0 0% 5%)",
        600: "hsl(0 0% 6%)",
        700: "hsl(0 0% 7%)",
        800: "hsl(0 0% 8%)",
        900: "hsl(0 0% 9%)",
      },
      red: {
        100: "hsl(0 80% 60%)",
        200: "hsl(0 97% 47%)",
      },
      gray: {
        100: "hsl(0 0% 44%)",
        200: "hsl(0 0% 38%)",
        300: "hsl(0 0% 32%)",
        400: "hsl(0 0% 26%)",
        500: "hsl(0 0% 22%)",
        600: "hsl(0 0% 18%)",
        700: "hsl(0 0% 14%)",
        800: "hsl(0 0% 12%)",
        900: "hsl(0 0% 10%)",
      },
      transparent: colors.transparent,
      inherit: colors.inherit,
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "992px",
      xl: "1100px",
    },
    container: {
      padding: {
        DEFAULT: "15px",
      },
    },
    extend: {
      borderRadius: {
        "2/4": "50%",
      },
      boxShadow: {
        blue: "inset 0 0 0 2px #138cd3",
      },
    },
  },
  plugins: [],
} satisfies Config;
