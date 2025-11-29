/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vivance-blue': {
          DEFAULT: '#0A3560',
          light: '#1A5080',
          dark: '#062440',
        },
        'vivance-orange': {
          DEFAULT: '#FC6603',
          light: '#FF8533',
          dark: '#D95500',
        },
        'vivance-yellow': '#FFD019',
        'vivance-red': '#FF1F25',
        'vivance-green': '#16C96F',
        'vivance-lime': '#C0FC1C',
        'vivance-peach': '#FD944E',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
