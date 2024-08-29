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
      class="bg-[#FABC3F] rounded-xl flex items-center justify-center py-3 px-6 border-b-4 border-[#936e24]"
      @click="startGame"
    >
      <SvgPlay class="text-white size-10" />
    </button>
  </div>
</template>

<script setup>
import SvgPlay from '@/components/icons/Play.vue';
import SvgThailand from '@/components/icons/Thailand.svg';
import SvgWorld from '@/components/icons/world.svg';

// const isHome = defineModel({
//   type: Boolean,
//   default: true,
// });
const emits = defineEmits(['start']);

const startGame = () => {
  console.log('start game');
  emits('start');
};
</script>

<style></style>
