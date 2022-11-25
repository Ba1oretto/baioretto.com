/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.tsx"
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      mobile: {
        max: "992px"
      },
      lg: '992px',
      xl: '1100px'
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
      backgroundColor: {
        dark: {
          DEFAULT: "#020409",
          frost: "#030710"
        }
      },
      boxShadow: {
        blue: "inset 0 0 0 2px #138cd3"
      },
      textColor: {
        dark: {
          DEFAULT: "#c9d1d9"
        },
        blue: {
          DEFAULT: "#138cd3"
        }
      },
      colors: {
        blue: {
          "600": "#426be7",
          "link": "#74aac0",
        },
        yellow: {
          "400": "#fac000",
          "450": "#c89312",
          "550": "#d28921",
          "600": "#b06418"
        },
        orange: {
          "900": "#5c320a"
        },
      }
    },
  },
  plugins: [],
}
