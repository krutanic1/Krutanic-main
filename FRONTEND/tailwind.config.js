/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#f15a27",
        "background-light": "#f8f6f6",
        "background-dark": "#221510",
        "surface-light": "#ffffff",
        "surface-dark": "#2c201d",
        "border-light": "#e8d5cf",
        "border-dark": "#4a3b36",
        "text-main": "#1c110d",
        "text-light": "#f3eae7",
        codenest: {
          green: '#5ed29c',
          bg: '#070b0a'
        }
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
        inter: ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        instrument: ['"Instrument Serif"', 'serif'],
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}