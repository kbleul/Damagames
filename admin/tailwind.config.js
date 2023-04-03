/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "secondary-bg": "#c026d3",
        "dark-gray": "#2C2C37",
        "main-bg": "#FF4C01",
        "light-gray": "#F7F7F7",
        "half-transparent": "#f2f6fc",
      },
      colors: {
        "main-color": "#FF4C01",
        "dark-color": "#666666",
      },
    },
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
  ],
};
