<script setup lang="ts">
const sysStore = useSystemStore()
const settingStore = useSettingStore()

await Promise.all([
  settingStore.getSettings(),
])

onMounted(() => {
  if(sysStore.isDark) {
    sysStore.toggleTheme()
  }
})
</script>

<template>
  <div class="w-full h-full">
    <section class="flex justify-center">
      <TheHeader />
    </section>

    <section>
      <TheMainContain />
    </section>

    <section>
      <TheFooter />
    </section>
  </div>
</template>
