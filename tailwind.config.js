/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // green accent
          light: '#10b981',
          dark: '#047857',
        }
      },
      fontFamily: {
        sans: ['Noto Sans Ethiopic', 'sans-serif'], // For Amharic support
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}