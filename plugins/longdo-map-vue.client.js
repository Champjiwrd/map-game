import LongdoMap from 'longdo-map-vue';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(LongdoMap, {
    load: {
      src: 'https://api.longdo.com/map3/',
      apiKey: '35b680dbb0b0ed5a6957e0a858ed48f0',
    },
  });
});
