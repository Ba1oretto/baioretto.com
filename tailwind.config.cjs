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
      gridTemplateRows: {
        "body": "auto 1fr auto",
        "video": "auto 1fr"
      },
      gridTemplateColumns: {
        "modal700": "minmax(auto,700px)",
        "modal500": "minmax(auto,500px)",
        "modal550": "minmax(auto,550px)",
        "modal600": "minmax(auto,600px)",
        "modal900": "minmax(auto,900px)"
      },
      colors: {
        dark: {
          "bg": "#020409",
          "text": "#c9d1d9",
          "test": "#030710"
        },
        blue: {
          "600": "#426be7"
        },
        yellow: {
          "550": "#eaa21a"
        }
      }
    },
  },
  plugins: [],
}
