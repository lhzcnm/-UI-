<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

const store = useSettingStore()
await store.getSettings()

onMounted(() => {
  const guestKey = import.meta.env.VITE_GUEST_TOKEN
  localStorage.removeItem(guestKey)
})
</script>

<template>
  <div class="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
  <div
    :class="twJoin(
      'flex flex-col items-center sm:justify-center',
      'sm:h-screen sm:px-4 sm:max-w-screen-md mx-auto'
    )"
  >
    <div class="flex justify-between items-center w-full h-20 px-4 sm:px-0">
      <TheLogo size="2rem" />
      <div class="flex space-x-2">
        <LanguageSwitch />
        <TheTheme size="1.5rem" />
      </div>
    </div>
    <main
      :class="twJoin(
        'flex flex-col sm:flex-row w-full p-4 sm:p-6',
        'overflow-hidden bg-card border rounded-2xl',
        'space-y-4 sm:space-y-0 sm:space-x-4',
      )"
    >
      <div class="h-44 sm:min-h-[21.5rem] sm:w-1/2">
        <img
          class="size-full rounded-lg object-cover"
          src="/images/auth_bg.png"
          alt="auth background"
          draggable="false"
        >
      </div>
      <RouterView />
    </main>
    
    <BaseFooter />
  </div>
</template>
