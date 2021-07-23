// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or false
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
}
