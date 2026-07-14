import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        't-dark': 'var(--color-bg-dark)',
        't-panel': 'var(--color-bg-panel)',
        't-card': 'var(--color-bg-card)',
        't-border': 'var(--color-border)',
        't-blue': 'var(--accent-blue)',
        't-cyan': 'var(--accent-cyan)',
        't-purple': 'var(--accent-purple)',
        't-red': 'var(--accent-red)',
        't-orange': 'var(--accent-orange)',
        't-yellow': 'var(--accent-yellow)',
        't-green': 'var(--accent-green)',
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
