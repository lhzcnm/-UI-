<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'

const route = useRoute()
const router = useRouter()

const order = ref<Order>()
const loading = ref(true)

const store = useSettingStore()
const serviceStore = useServiceStore()
const codeId = Number(route.query.codeId)

await Promise.all([
  serviceStore.getServices(),
  store.getSettings(),
  getOrder(),
])

async function getOrder() {
  if (!codeId) {
    toast.warning('订单ID不能为空')
    return router.push('/')
  }

  try {
    const response = await orderApi.item(codeId)
    order.value = response.data
  }
  catch (error) {
    return router.push('/')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-100 dark:bg-black">
    <div class="max-w-xl mx-auto p-3">
      <Fallback v-if="loading" />
  
      <template v-else>
        <OrderCard v-if="order" :order="order" />
        <div v-else class="p-8 text-center text-muted-foreground">
          未找到订单信息
        </div>
  
        <BaseFooter />
      </template>
    </div>
  </div>
</template>
