<script setup lang="ts">
import FormCard from './components/FormCard.vue'
import DataCard from './components/DataCard.vue'
import BulkApiCard from './components/BulkApiCard.vue'
import ApiKeyCard from './components/ApiKeyCard.vue'
import AppCard from './components/AppCard.vue'

const store = useUserStore()
await store.getInfo(true)

const chatVisible = ref(false)
const mode = import.meta.env.VITE_APP_MODE

const qrcode = computed(() => {
  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/customer_service_qrcode.jpg`
})
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl">个人中心</h2>

      <div class="flex items-center space-x-2">
        <XPopover
          v-model="chatVisible" trigger="hover"
          ui-content="p-4"
        >
          <template #trigger>
            <XButton icon="lucide:headset" label="联系客服" />
          </template>

          <div class="w-64 border rounded overflow-hidden">
            <img :src="qrcode" alt="客服二维码" draggable="false" class="size-full">
          </div>
        </XPopover>
        <XButton
          label="安全退出" color="danger"
          @click="store.logout"
        />
      </div>
    </div>

    <div class="flex items-start space-x-4">
      <FormCard />
      <section class="flex-1">
        <DataCard />
        <div class="flex flex-wrap items-start gap-4 mt-4">
          <ApiKeyCard />
          <BulkApiCard />
          <!-- <AppCard v-if="mode === 'SanHe'" /> -->
          <AppCard />
        </div>
      </section>
    </div>
  </div>
</template>
