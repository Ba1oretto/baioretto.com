import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  darkMode: [ "class" ],
  content: [
    "./app/**/*.tsx",
  ],
  theme: {
    colors: {
      "gainsboro-gray": "hsl(0 0% 92%)",
      "light-gray": "hsl(60 5% 84%)",
      "warm-gray": "hsl(60 5% 70%)",
      "dim-gray": "hsl(0 0% 64%)",
      "slate-gray": "hsl(60 5% 58%)",
      "dark-gray": "hsl(0 0% 17%)",
      "forest-green": "hsl(123 41% 45%)",
      "seaweed-green": "hsl(149 62% 39%)",
      "azure": "hsl(202 83% 45%)",
      "royal-blue": "hsl(220 100% 48%)",
      "cobalt-blue": "hsl(220 100% 42%)",
      "darkish-blue": "hsl(213 76% 31%)",
      "slate-blue": "hsl(220 50% 12%)",
      "deep-azure": "hsl(220 100% 12%)",
      "midnight-blue": "hsl(220 100% 6%)",
      "ink-blue": "hsl(220 100% 5%)",
      "abyss-blue": "hsl(223 70% 2%)",
      "goldenrod-yellow": "hsl(38 90% 48%)",
      "tangerine-orange": "hsl(31 92% 50%)",
      "sienna-orange": "hsl(23 82% 31%)",
      "crimson": "hsl(0 80% 60%)",
      "dark-plum": "hsl(319 65% 13%)",
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
        "1/2": "50%",
      },
      boxShadow: {
        aureole: "inset 0 0 0 2px #138cd3",
      },
    },
  },
  plugins: [],
} satisfies Config;
