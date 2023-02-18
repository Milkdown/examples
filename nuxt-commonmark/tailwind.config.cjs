/* Copyright 2021, Milkdown by Mirone. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.{ts,vue,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
