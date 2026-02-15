import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#fdf8f0',
          100: '#faf0dc',
          200: '#f5e0b8',
          300: '#eecb8a',
          400: '#e5b05c',
          500: '#d4924a',
        },
        bark: {
          100: '#e8ddd0',
          200: '#c9b89e',
          300: '#a8916c',
          400: '#7a6248',
          500: '#4d3d28',
          600: '#2e2316',
        },
        moss: {
          400: '#7a8c6e',
          500: '#5c6e50',
          600: '#3e4f35',
        },
        ember: {
          400: '#c9694a',
          500: '#b04d30',
        }
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
export default config
