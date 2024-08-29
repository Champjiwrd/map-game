// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Province Thailand - map game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'Province Thailand',
          content: 'ทายจังหวัด',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/map-game/favicon.ico' }],
    },

    baseURL: '/map-game/', // Ensure this matches your GitHub repository name
  },
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  plugins: ['~/plugins/longdo-map-vue.client.js'],
  modules: ['@nuxtjs/google-fonts'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleFonts: {
    // Options
    display: 'auto',
    families: {
      Prompt: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
});