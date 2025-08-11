<script setup lang="ts">
const route = useRoute()

const mode = import.meta.env.VITE_APP_MODE

const isAuth = computed(() => route.path.includes('auth'))
</script>

<template>
  <div>
    <img :src="`/${mode}/logo.svg`" :class="['w-32', { 'w-48': isAuth }]" alt="">
  </div>
</template>
