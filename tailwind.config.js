/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./layouts/**/*.html", "./content/**/*.md"],
  theme: {
    extend: {
      colors: {
        customGrayDark: "#68696e",
        customGrayLight: "#83858C",
        customBlueDark: "#2493d4",
        customBlueLight: "#38b6ff",
      },
    },
  },
  plugins: [],
};
