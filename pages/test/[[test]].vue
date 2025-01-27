<template>
  <div>{{ country }}</div>
</template>

<script setup>
const route = useRoute();
const country = route.params.test;
useSeoMeta({
  title: `เกมทายแผนที่ ${country.toUpperCase()} | เกมทดสอบความรู้ภูมิศาสตร์ ${country.toUpperCase()} ของคุณ`,
  ogTitle: `เกมทายแผนที่ ${country.toUpperCase()} | เกมทดสอบความรู้ภูมิศาสตร์ ${country.toUpperCase()} ของคุณ`,
  description: `ทายเมืองต่าง ๆ บนแผนที่ ${country.toUpperCase()} และทดสอบความรู้ภูมิศาสตร์ของคุณ! เกมสนุก ๆ ที่จะช่วยคุณจำ ${country.toUpperCase()} ได้ดียิ่งขึ้น`,
  ogDescription: `มาลองทายเมืองต่าง ๆ บนแผนที่ ${country.toUpperCase()} ดูว่าคุณจำได้กี่เมือง! เกมสนุก ๆ ท้าทายความรู้ภูมิศาสตร์`,
});
</script>
