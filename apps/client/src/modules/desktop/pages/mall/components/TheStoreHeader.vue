<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div
    class="h-store-header grid items-center justify-items-center bg-zinc-50 dark:bg-zinc-900 shadow-sm"
    style="grid-template-columns: auto 1fr auto;"
  >
    <section class="size-full border-r border-dashed flex items-center px-4">
      <TheLogo />
    </section>
    <div></div>
    <section class="size-full border-l border-dashed flex items-center space-x-2 px-4">
      <XInput
        uiRoot="w-28 rounded-full hover:w-64 focus-within:w-64"
        style="transition: width 0.3s ease;"
        icon="lucide:search"
        clearable :placeholder="t('store.order.search')"
      />
      <LanguageSwitch />
      <TheTheme />
    </section>
  </div>
</template>
