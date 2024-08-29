<!-- src/components/Stopwatch.vue -->
<template>
  <div class="stopwatch">
    <h1>{{ formattedTime }}</h1>
    <!-- <button @click="startStopwatch">{{ isRunning ? 'Pause' : 'Start' }}</button> -->
    <!-- <button @click="resetStopwatch" :disabled="isRunning">Reset</button> -->
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const elapsedTime = ref(0); // Time in milliseconds
const isRunning = ref(false);
let intervalId = null;

const startStopwatch = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    intervalId = setInterval(() => {
      elapsedTime.value += 100; // Update every 100 milliseconds
    }, 100);
  } else {
    isRunning.value = false;
    clearInterval(intervalId);
  }
};

const resetStopwatch = () => {
  elapsedTime.value = 0;
  if (isRunning.value) {
    clearInterval(intervalId);
    isRunning.value = false;
  }
};

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60000);
  const seconds = Math.floor((elapsedTime.value % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
});

onUnmounted(() => {
  if (isRunning.value) {
    clearInterval(intervalId);
  }
});

defineExpose({
  isRunning,
  startStopwatch,
  resetStopwatch,
});
</script>

<style scoped>
.stopwatch {
  text-align: center;
}

button {
  margin: 10px;
  font-size: 1em;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
