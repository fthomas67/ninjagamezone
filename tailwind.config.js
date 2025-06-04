/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'border-appInputBorder'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD600',
        },
        accent: {
          DEFAULT: '#FFD600',
        },
        background: '#191c26',
        card: '#21242f',
        sidebar: '#21242f',
        header: '#191c26',
        border: '#191c26',
        'border-light': '#2d2d42',
        foreground: '#fff',
        muted: '#B0B0B0',
        hover: '#353545',
        'button-brand': '#191c26',
      },
      borderColor: {
        appInputBorder: '#353545',
      },
      fontFamily: {
        sans: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-yellow': 'linear-gradient(90deg, #FFD700, #FFA500)',
        'gradient-yellow-hover': 'linear-gradient(90deg, #FFE44D, #FFB700)',
      },
      boxShadow: {
        'yellow-glow': '0 0 12px rgba(255, 215, 0, 0.3), 0 -2px #FF8C00 inset',
        'yellow-glow-hover': '0 0 20px rgba(255, 215, 0, 0.5), 0 -2px #FF8C00 inset, 0 0 30px rgba(255, 215, 0, 0.2)',
      },
      transform: {
        'scale-hover': 'scale(1.05)',
      },
    },
  },
  plugins: [],
}