<script setup lang="ts">
import LogoComponent from '@logo'
import { modeOptions, type ModeKey } from '@/types'

interface TheLogoProps {
  width?: string
  height?: string
  showLogo?: boolean
}

const props = withDefaults(
  defineProps<TheLogoProps>(),
  {
    showLogo: true,
    width: "",
    height: "auto",
  }
)

const mode = import.meta.env.VITE_APP_MODE as ModeKey
// const logo = await import(`./logos/${mode}.vue`)

const compWidth = computed(() => {
  return props.width ? props.width : modeOptions[mode].width
})
</script>

<template>
  <!-- <h1 class="cursor-default select-none flex"> -->
  <RouterLink to="/" class="inline-flex items-center justify-center text-[0px] align-bottom">
    <img v-if="showLogo" class="w-6 h-6 mr-2" :src="`/${mode}/favicon.png`" alt="">
    <component :is="LogoComponent" :style="{ width: compWidth, height: height }" />
  </RouterLink>
  <!-- </h1> -->
</template>
