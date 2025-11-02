/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: 'class', // Dark mode için class stratejisi
  theme: {
    extend: {
      colors: {
        'base-background': '#EEEEEE',
        'danger':'#e11d48',
        'success':'#22c55e',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

