
<script setup lang="ts">
const processTime = ref(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
setInterval(() => {
  processTime.value = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}, 1000)
</script>

<template>
  <div class="w-full flex items-center justify-center h-7 bg-transparent text-black dark:text-white">
    <span class="text-[16px] font-semibold tracking-tight select-none">
      {{ processTime }}
    </span>
  </div>
</template>
