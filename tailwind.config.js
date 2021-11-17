const { lightBlue, ...supportedColors } = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./views/**/*.{js,jsx,ts,tsx,hbs}",
    "./public/index.html",
    "./forms/**/*.{js,jsx,ts,tsx,hbs}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: { ...supportedColors },
    },
    backgroundImage: {
      "login-dark":
        "url('https://images.unsplash.com/photo-1510133744874-096621a0e01e')",
      "login-light":
        "url('https://images.unsplash.com/photo-1583248881102-32809a3f6130')",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
