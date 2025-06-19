/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003c3c',
        secondary: '#2ec4b6',
        accent: '#ffffff',
        page: {
          bg: '#e5e7eb'
        },
        grid: '#d1d5db',
      },
    },
  },
  plugins: [],
} 