<template>
  <div
    class="bg-white p-4 rounded-xl shadow-xl font-semibold border-b-4 border-sky-500 flex items-center"
  >
    <SvgHeartFill
      v-for="i in 3 - attempt"
      :key="i"
      class="text-[#D37676] size-5"
    />
    <SvgHeartFill v-for="i in attempt" :key="i" class="text-[#c5c5c5] size-5" />
  </div>
</template>

<script setup>
import SvgHeartFill from '@/components/icons/HeartFill.vue';
defineProps({
  attempt: {
    type: Number,
    default: 0,
  },
});
</script>

<style></style>
