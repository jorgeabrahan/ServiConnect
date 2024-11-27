/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(17, 24, 39)',
        secondary: 'rgb(156, 163, 175)'
      }
    },
  },
  plugins: [],
}

