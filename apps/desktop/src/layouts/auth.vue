<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

const store = useSettingStore()
await store.getSettings()
</script>

<template>
  <div class="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
  <div class="flex flex-col items-center sm:justify-center sm:h-screen sm:px-4 sm:max-w-screen-md mx-auto">
    <div class="flex justify-between items-center w-full h-20 px-4 sm:px-0">
      <TheLogo size="2rem" />
      <TheTheme size="1.5rem" />
    </div>
    <main
      :class="twMerge(
        'flex flex-col sm:flex-row gap-4',
        'w-full p-4 sm:p-6 overflow-hidden',
        'rounded-2xl bg-card border shadow-sm'
      )"
    >
      <div class="h-44 sm:min-h-[21.5rem] sm:flex-1">
        <img
          class="w-full h-full rounded-lg object-cover"
          src="/images/auth_bg.png"
          alt="auth background"
          draggable="false"
        >
      </div>
      <RouterView />
    </main>
    <footer class="flex justify-center gap-2 my-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span>
        © {{ new Date().getFullYear() }} {{ store.settings.title }}
        <a href="http://lushensanhe.com" target="_blank" class="underline text-primary">陆深三和</a>版权所有
      </span>·
      <span><a href="https://beian.miit.gov.cn/" target="_blank" class="underline">{{ store.settings.beian }}</a></span>
    </footer>
  </div>
</template>
