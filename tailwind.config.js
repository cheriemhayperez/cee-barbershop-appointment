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
          DEFAULT: '#c4a172',
          hover: '#d4b48a',
          light: 'rgba(196, 161, 114, 0.15)',
        },
        cb: {
          dark: '#141414',
          surface: '#111111',
          muted: '#5c5c5c',
          border: '#e5e0d8',
          admin: '#f8f6f2',
        },
      },
      borderRadius: {
        cb: '10px',
      },
      boxShadow: {
        gold: '0 4px 14px rgba(196, 161, 114, 0.28)',
      },
    },
  },
  plugins: [],
};
