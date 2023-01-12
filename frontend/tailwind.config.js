/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "dark-bg": "#181920",
        "dark-gray": "#2C2C37",
        "orange-bg": "#FF4C01",
      },
      colors: {
        "orange-color": "#FF4C01",
      },
    },
  },
  plugins: [],
};
