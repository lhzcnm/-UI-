<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheMainContain from './components/TheMainContain.vue'
import TheFooter from './components/TheFooter.vue'

const settingStore = useSettingStore()

await Promise.all([
  settingStore.getSettings(),
])
</script>

<template>
  <div class="w-full max-h-screen bg-white flex flex-col">
    <TheHeader />

    <main class="flex-1 overflow-y-auto">
      <TheMainContain />
      <TheFooter />
    </main>
  </div>
</template>
