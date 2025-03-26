<script setup lang="ts">
interface TheLogoProps {
  width?: string
  height?: string
}

defineProps<TheLogoProps>()

const mode = import.meta.env.VITE_APP_MODE
const logo = await import(`./logos/${mode}.vue`)
</script>

<template>
  <h1 class="cursor-default select-none">
    <RouterLink to="/" class="inline-block text-[0px] align-bottom">
      <component :is="logo.default" :width="width" :height="height" />
    </RouterLink>
  </h1>
</template>
