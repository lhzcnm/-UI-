<script setup lang="ts">
import LogoSvg from '/logo.svg?raw'

defineProps({
  size: {
    type: String,
    default: '1.75rem',
  },
})
</script>

<template>
  <h1 class="cursor-default select-none">
    <RouterLink to="/" class="inline-block text-[0px] align-bottom" v-html="LogoSvg" />
  </h1>
</template>

<style>
.logo {
  display: inline-block;
  height: v-bind('size');
}
</style>
