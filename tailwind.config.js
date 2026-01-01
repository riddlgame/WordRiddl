
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        reveal: {
          '0%': { transform: 'scale(1, 0)' },
          '100%': { transform: 'scale(1, 1)' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
      },
      animation: {
        reveal: 'reveal 0.4s ease-out forwards',
        shake: 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both',
        blink: 'blink 1s step-end infinite',
      }
    },
  },
  plugins: [],
}
