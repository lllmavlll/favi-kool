/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'kool': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
} 