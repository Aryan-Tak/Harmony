/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgba(255, 245, 225, 0.1), 0 2px 4px -1px rgba(255, 245, 225, 0.06)',
      }
    },
  },
  plugins: [],
}

