<script setup lang="ts">
const store = useSettingStore()
const { t } = useI18n()
</script>

<template>
  <footer class="flex justify-center space-x-1 my-2 text-xs text-muted-foreground">
    <span>
      © {{ new Date().getFullYear() }} {{ store.settings.title }}
      <a href="http://lushensanhe.com" target="_blank" class="underline text-primary">{{ t('footer.msg2') }}</a>
      {{ t('footer.msg3') }}
    </span>
    <span>·</span>
    <span>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="underline">
        {{ store.settings.beian }}
      </a>
    </span>
  </footer>
</template>
