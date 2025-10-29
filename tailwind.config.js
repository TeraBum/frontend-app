/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#24DBC5',    // cor principal
        secondary: '#E8EEF5',  // cor secundária
        black: '#000000',       // preto
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],  // fonte principal
      },
    },
  },
  plugins: [],
};
