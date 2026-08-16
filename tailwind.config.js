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
        primary: {
          DEFAULT: '#093421',
          container: '#1b5e20',
          light: '#234b36',
          fixed: '#c0edd0',
          'fixed-dim': '#91d78a',
        },
        secondary: {
          DEFAULT: '#3e6a00',
          container: '#b9f474',
          accent: '#7f5600',
          warm: '#fec25e',
        },
        surface: {
          DEFAULT: '#f9faf6',
          dim: '#dadad7',
          bright: '#f9faf6',
          lowest: '#ffffff',
          low: '#f3f4f0',
          container: '#eeeeea',
          high: '#e8e8e5',
          highest: '#e2e3df',
          variant: '#dee4dc',
        },
        'on-surface': {
          DEFAULT: '#171d18',
          variant: '#41493e',
          muted: '#717a6d',
        },
        outline: {
          DEFAULT: '#d8ddd6',
          variant: '#c0c9bb',
          dark: '#717a6d',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          text: '#93000a',
        },
        warning: {
          DEFAULT: '#d97706',
          container: '#fef3c7',
          text: '#92400e',
        },
        info: {
          DEFAULT: '#0284c7',
          container: '#e0f2fe',
          text: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(27, 94, 32, 0.04)',
        lift: '0 8px 24px rgba(27, 94, 32, 0.08)',
        modal: '0 20px 40px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
