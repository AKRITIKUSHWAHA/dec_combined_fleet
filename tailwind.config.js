/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dec: {
          blue: {
            50: '#f0f7ff',
            100: '#e0effe',
            500: '#0066cc',
            600: '#0052a3',
            700: '#003d7a',
            800: '#002952',
            900: '#001a33',
          },
          amber: {
            500: '#f59e0b',
            600: '#d97706',
          },
          emerald: {
            500: '#10b981',
            600: '#059669',
          },
          ruby: {
            500: '#ef4444',
            600: '#dc2626',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
