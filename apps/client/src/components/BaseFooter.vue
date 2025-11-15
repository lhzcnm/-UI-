<script setup lang="ts">
const { settings } = useSettingStore()
const { t, locale } = useI18n()

const displayTitle = computed(() => {
  return locale.value === 'zh' ? settings.title : settings.titleEn ? settings.titleEn : settings.title
})
</script>

<template>
  <footer class="flex justify-center space-x-1 my-2 text-xs text-muted-foreground">
    <span>
      © {{ new Date().getFullYear() }} {{ displayTitle }}
      <a href="http://lushensanhe.com" target="_blank" class="underline text-primary">{{ t('footer.msg2') }}</a>
      {{ t('footer.msg3') }}
    </span>
    <span>·</span>
    <span>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="underline">
        {{ settings.beian }}
      </a>
    </span>
  </footer>
</template>
