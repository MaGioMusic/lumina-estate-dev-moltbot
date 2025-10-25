/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Natural Earth Tones Palette
        primary: {
          50: '#faf9f7',
          100: '#f5f2ec',
          200: '#ebe4d6',
          300: '#ddd0b8',
          400: '#BF9264', // Warm Brown - Main Brand Color
          500: '#a67c55',
          600: '#8f6746',
          700: '#75533a',
          800: '#614432',
          900: '#53392c',
        },
        sage: {
          50: '#f6f8f4',
          100: '#eef2e7',
          200: '#dde5d1',
          300: '#c4d3b0',
          400: '#6F826A', // Sage Green - Secondary Color
          500: '#5a6b55',
          600: '#485544',
          700: '#3a4438',
          800: '#30372f',
          900: '#282e27',
        },
        mint: {
          50: '#f8fdf6',
          100: '#f0faeb',
          200: '#BBD8A3', // Light Mint Green - Accent Color
          300: '#9bc97d',
          400: '#7bb558',
          500: '#5f9939',
          600: '#4a7a2a',
          700: '#3d6124',
          800: '#334e20',
          900: '#2c421e',
        },
        cream: {
          50: '#fefef9',
          100: '#fdfdea',
          200: '#F0F1C5', // Soft Cream - Background Color
          300: '#e8eaa0',
          400: '#dde270',
          500: '#d1d644',
          600: '#b8c228',
          700: '#94a019',
          800: '#798018',
          900: '#676b19',
        },
        // Keep existing grays for UI elements
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'earth-gradient': 'linear-gradient(135deg, #F0F1C5 0%, #BBD8A3 50%, #6F826A 100%)',
        'warm-gradient': 'linear-gradient(135deg, #BF9264 0%, #6F826A 100%)',
      },
    },
  },
  plugins: [],
} 