
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5D5CDE',
      },
      fontFamily: {
        'sans': ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
