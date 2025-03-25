<script setup lang="ts">
import BaseInfo from './components/BaseInfo.vue'
import DataInfo from './components/DataInfo.vue'
import ApiInfo from './components/ApiInfo.vue'
import AppInfo from './components/AppInfo.vue'

const store = useUserStore()
await store.getInfo(true)

const chatVisible = ref(false)

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
        <XPopover v-model="chatVisible">
          <template #trigger>
            <XButton color="indigo" icon="lucide:headset">
              联系客服
            </XButton>
          </template>
  
          <div class="bg-card border rounded-lg p-4 shadow-lg">
            <div class="w-64 border rounded overflow-hidden">
              <img :src="qrcode" alt="客服二维码" draggable="false" class="size-full">
            </div>
          </div>
        </XPopover>
        <XButton
          label="安全退出" color="rose"
          @click="store.logout"
        />
      </div>
    </div>

    <div class="flex items-start space-x-4">
      <BaseInfo />

      <section class="flex-1">
        <DataInfo />

        <div class="flex items-start gap-4 mt-4">
          <ApiInfo />
          <AppInfo />
        </div>
      </section>
    </div>

  </div>
</template>
