module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Sans MS"', 'Comic Neue', 'cursive'],
      },
      colors: {
        pow: "#0ff0db",
        boom: "#f472b6",
      },
    },
  },
  plugins: [],
};