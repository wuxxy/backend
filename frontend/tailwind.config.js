/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        prim: {
          50: "#eeefff",
          100: "#dcdeff",
          200: "#b2bbff",
          300: "#6d81ff",
          400: "#2040ff",
          500: "#0016ff",
          600: "#0006df",
          700: "#0003b4",
          800: "#000595",
          900: "#00047a",
          950: "#000005",
        },
      },
    },
  },
  plugins: [],
};
