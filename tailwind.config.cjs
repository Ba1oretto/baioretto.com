/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.tsx"
  ],
  theme: {
    extend: {
      container: {
        padding: {
          DEFAULT: "15px"
        }
      },
      borderRadius: {
        "2/4": "50%"
      },
      gridTemplateRows: {
        "body": "auto 1fr auto",
        "video": "auto 1fr"
      },
      colors: {
        dark: {
          "bg": "#020409",
          "text": "#c9d1d9"
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
