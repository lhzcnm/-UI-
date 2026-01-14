<script setup lang="ts">
const route = useRoute()

const data = ref<any>("")

watch(
  () => route.query.data,
  (val) => {
    data.value = val
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="whitespace-pre-line">{{ data }}</div>
</template>
