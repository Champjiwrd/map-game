<template>
  <div
    class="absolute top-0 right-0 bottom-0 left-0 bg-[#1E2A5E] z-10 flex flex-col items-center justify-center space-y-10"
  >
    <div
      class="text-white font-extrabold text-5xl text-center flex justify-center flex-col"
      style="text-shadow: 0px 4px #000"
    >
      <div>จังหวัด</div>
      <div>ในประเทศไทย?</div>
    </div>
    <div class="flex items-center justify-center">
      <div class="rounded-full bg-[#1184c7] w-60">
        <img class="w-full" :src="SvgThailand" />
      </div>
    </div>
    <button
      class="rounded-xl flex items-center justify-center py-3 px-6 border-b-4 border-[#936e24] active:border-y-2"
      @click="startGame"
      :class="isMapLoaded ? 'bg-[#FABC3F]' : 'bg-[#9a8763]'"
      :disabled="!isMapLoaded"
    >
      <SvgPlay class="text-white size-10" />
    </button>
  </div>
</template>

<script setup>
import SvgPlay from '@/components/icons/Play.vue';
import SvgThailand from '@/components/icons/thailand.svg';

const props = defineProps({
  isMapLoaded: {
    type: Boolean,
    default: false,
  },
});

// const isHome = defineModel({
//   type: Boolean,
//   default: true,
// });
const emits = defineEmits(['start']);

const startGame = () => {
  console.log('start game');
  setTimeout(() => {
      emits('start');
  }, 1000);
};
</script>

<style></style>
