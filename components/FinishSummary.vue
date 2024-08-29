<template>
  <div
    class="absolute bg-[#1E2A5E] top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center"
  >
    <div class="bg-[#F5F3E4] border-b-8 border-[#8a8670] w-60 rounded-2xl p-5">
      <div class="text-center font-extrabold text-5xl">SCORE</div>
      <div
        class="bg-[#DED9CE] p-4 text-center font-bold text-4xl rounded-xl mt-4"
      >
        {{ score }}
      </div>
      <div class="mt-4 flex justify-center">
        <button
          class="bg-[#FABC3F] rounded-xl flex items-center justify-center py-3 px-6 border-b-4 border-[#936e24]"
          @click="newGame"
        >
          <SvgPlay class="text-white size-10" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import SvgPlay from '@/components/icons/Play.vue';
defineProps({
    score: {
        type: Number,
        default:0
    }
})
const emits = defineEmits(['newGame'])
const newGame = () => {
    emits('newGame')
}
</script>
