/* Copyright 2021, Milkdown by Mirone. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['**/*.tsx', '**/*.ts', '**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
