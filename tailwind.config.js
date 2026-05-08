/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        cosmos: {
          950: '#00010f',
          900: '#020617',
          800: '#0a0f2e',
          700: '#0d1845',
        },
        nebula: {
          cyan:    '#06b6d4',
          blue:    '#3b82f6',
          purple:  '#8b5cf6',
          pink:    '#ec4899',
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'twinkle-slow': 'twinkle 5s ease-in-out infinite',
        'twinkle-fast': 'twinkle 1.5s ease-in-out infinite',
        'shooting-star': 'shooting-star 6s ease-in-out infinite',
        'orbit': 'orbit 12s linear infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'nebula-drift': 'nebula-drift 20s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'twinkle': {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        'shooting-star': {
          '0%': { transform: 'translateX(-100px) translateY(-100px)', opacity: 0 },
          '10%': { opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'translateX(1200px) translateY(600px)', opacity: 0 },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' },
          '50%': { boxShadow: '0 0 20px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' },
        },
        'nebula-drift': {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: 0.4 },
          '50%': { transform: 'translate(2%, -2%) scale(1.05)', opacity: 0.6 },
          '100%': { transform: 'translate(-1%, 1%) scale(0.98)', opacity: 0.5 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
