// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      Prompt: [100,200,300,400,500,600,700,800,900],
    },
  },
});