// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // make sure this includes your component paths
  ],
  safelist: [
    {
      pattern: /from-\[#.*\]/,
    },
    {
      pattern: /to-\[#.*\]/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        fredoka: ['Fredoka One', 'cursive'],
        header: ['Bebas Neue', 'cursive'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
