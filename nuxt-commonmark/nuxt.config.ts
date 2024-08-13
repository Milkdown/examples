// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/style.css', '@milkdown/theme-nord/style.css'],

  postcss: {
      plugins: {
          tailwindcss: {},
      },
  },

  compatibilityDate: '2024-08-13',
})