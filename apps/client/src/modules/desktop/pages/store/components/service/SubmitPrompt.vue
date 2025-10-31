<script setup lang="ts">
const store = useSettingStore()
const { t, locale } = useI18n()

const prompt = computed(() => {
  return locale.value === 'zh'
    ? store.settings.mallWarmReminderZH
    : store.settings.mallWarmReminderEN
      ? store.settings.mallWarmReminderEN
      : store.settings.mallWarmReminderZH
})
</script>

<template>
  <div class="p-5 bg-white dark:bg-black border border-border rounded-lg pt-4 border-t dark:shadow-zinc-900 shadow-lg">
    <div class="pb-4 flex items-center space-x-2">
      <div class="w-2 h-6 bg-primary rounded"></div>
      <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">下单提醒</span>
    </div>
    <div class="border border-border rounded-xl text-sm text-zinc-600 dark:text-zinc-400 px-4 py-2 leading-relaxed" v-html="prompt"></div>
  </div>
</template>
