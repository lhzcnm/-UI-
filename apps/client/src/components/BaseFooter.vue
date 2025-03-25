<script setup lang="ts">
const store = useSettingStore()
</script>

<template>
  <footer class="flex justify-center space-x-2 my-2 text-xs text-zinc-500 dark:text-zinc-400">
    <span>
      © {{ new Date().getFullYear() }} {{ store.settings.title }}
      <a href="http://lushensanhe.com" target="_blank" class="underline text-primary">陆深三和</a>版权所有
    </span>·
    <span><a href="https://beian.miit.gov.cn/" target="_blank" class="underline">{{ store.settings.beian }}</a></span>
  </footer>
</template>
