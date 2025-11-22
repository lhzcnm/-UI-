<script setup lang="ts">
const { setting } = useSettingStore()
const { t, locale } = useI18n()

const prompt = computed(() => {
  return locale.value === 'zh'
    ? setting.mallWarmReminderZH
    : setting.mallWarmReminderEN
      ? setting.mallWarmReminderEN
      : setting.mallWarmReminderZH
})
</script>

<!-- <template>
  <div class="p-5 bg-white dark:bg-black border border-border rounded-lg pt-4 border-t dark:shadow-zinc-900 shadow-lg">
    <div class="pb-4 flex items-center space-x-2">
      <div class="w-2 h-6 bg-primary rounded"></div>
      <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">{{ t('shop.prompt.submit') }}</span>
    </div>
    <div class="border border-border rounded-xl text-sm text-zinc-600 dark:text-zinc-400 px-4 py-2 leading-relaxed" v-html="prompt"></div>
  </div>
</template> -->

<template>
  <div class="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm bg-white dark:bg-zinc-900">
    <h3 class="text-lg font-medium text-zinc-800 dark:text-zinc-100 mb-2">
      {{ t('shop.prompt.submit') }}
    </h3>

    <!-- <ul class="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
      <li>请确认提交内容正确。</li>
      <li>服务可能需要几分钟处理，请耐心等待。</li>
      <li>支持批量提交，每行一个 IMEI。</li>
    </ul> -->
    <div v-html="prompt"></div>
  </div>
</template>
