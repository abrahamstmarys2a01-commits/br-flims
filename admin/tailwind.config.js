/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C6283D',
          'red-hover': '#A51D30',
          'red-light': '#FDF2F4',
          gold: '#C9A44C',
          'gold-light': '#E9D79F',
          'gold-dark': '#A37F2C',
        },
        surface: {
          warm: '#FFF9F0',
          light: '#F7F7F8',
          card: '#FFFFFF',
        },
        text: {
          main: '#252525',
          secondary: '#686868',
          muted: '#8E8E93',
        },
        border: {
          subtle: '#E8E8EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        cinema: '0 10px 30px -10px rgba(198, 40, 61, 0.15)',
        gold: '0 8px 24px -6px rgba(201, 164, 76, 0.25)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
