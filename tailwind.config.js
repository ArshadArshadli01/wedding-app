/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/app/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        script:    ["'Pinyon Script'", "cursive"],
        cinzel:    ["'Cinzel'", "serif"],
        cormorant: ["'Cormorant Garamond'", "serif"],
      },
    },
  },
  plugins: [],
};
