<script setup lang="ts">
const mode = import.meta.env.VITE_APP_MODE
</script>

<template>
  <div class="flex items-center p-5">
    <img class="w-6 h-6 mr-2" :src="`/${mode}/favicon.png`" alt="">
    <img class="w-32" :src="`/${mode}/logo.svg`" alt="">
  </div>
</template>
