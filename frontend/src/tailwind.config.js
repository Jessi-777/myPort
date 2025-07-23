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
    extend: {},
  },
  plugins: [],
};
