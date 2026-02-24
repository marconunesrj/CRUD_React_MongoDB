/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0d0f14',
          card: '#141720',
          hover: '#1b1f2e',
          border: '#252a3a',
        },
        accent: {
          DEFAULT: '#6c63ff',
          light: '#8b85ff',
          glow: 'rgba(108, 99, 255, 0.25)',
        },
        success: '#22d3a5',
        danger: '#ff5f6d',
        warning: '#fbbf24',
        muted: '#4a5170',
        text: {
          DEFAULT: '#e8eaf0',
          secondary: '#8b90a8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      boxShadow: {
        glow: '0 0 24px rgba(108, 99, 255, 0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}