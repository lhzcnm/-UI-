<script setup lang="ts">
interface TheLogoProps {
  size?: string
}

withDefaults(
  defineProps<TheLogoProps>(),
  {
    size: '1.75rem',
  },
)

const mode = import.meta.env.VITE_APP_MODE
const logo = await import(`./logo/${mode}.vue`)
</script>

<template>
  <h1 class="cursor-default select-none">
    <RouterLink to="/" class="inline-block text-[0px] align-bottom">
      <component :is="logo.default" :height="size" />
    </RouterLink>
  </h1>
</template>
