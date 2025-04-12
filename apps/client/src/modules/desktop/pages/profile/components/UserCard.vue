<script setup lang="ts">
const store = useUserStore()
const iStore = useSettingStore()
</script>

<template>
  <div class="flex items-center space-x-3">
    <TheAvatar class="size-20 cursor-default" />
    <div class="h-full">
      <div class="mb-1.5 text-lg">
        {{ store.info.nickname || iStore.settings.title }}
      </div>

      <div class="space-x-2">
        <XTag color="blue" :label="`ID:${store.info.userId}`" />
        <XTag color="rose" :label="store.info.pricePlan" />
      </div>
    </div>
  </div>
</template>
