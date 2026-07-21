/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a227',
          light: 'rgba(201, 162, 39, 0.15)',
        },
        cb: {
          dark: '#1a1a1a',
          surface: '#242424',
          muted: '#666666',
          border: '#e5e5e5',
          admin: '#f5f5f5',
        },
      },
      borderRadius: {
        cb: '10px',
      },
    },
  },
  plugins: [],
};
