<script setup lang="ts">
import TheHeader from '@desktop/components/TheHeader.vue'
import TheMainContain from '@desktop/components/TheMainContain.vue'
import TheFooter from '@desktop/components/TheFooter.vue'

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
