<script setup>
const { href } = defineProps({
  href: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <a :href="href" target="_blank">点击进入</a>
</template>

<style lang="scss" scoped></style>
