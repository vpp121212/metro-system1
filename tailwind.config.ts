import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        't-dark': '#060b18',
        't-panel': '#0d1321',
        't-card': '#141c2e',
        't-border': '#1e2a42',
        't-blue': '#2563eb',
        't-cyan': '#06b6d4',
        't-purple': '#9333ea',
        't-red': '#ef4444',
        't-orange': '#f97316',
        't-yellow': '#eab308',
        't-green': '#22c55e',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
