<script setup lang="ts">
import ImportArea from './components/ImportArea.vue'
import ContentArea from './components/ContentArea.vue'

import { toast } from 'vue-sonner'

import { STORE, type OrderEditStore } from './utils'
import { batchUpdateOrder } from '@/api/orders'

const iStore = useSystemStore()

const store: OrderEditStore = reactive({
  items: iStore.selectedOrders,

  serviceId: undefined,
  status: undefined,
  isCode: true,
})

provide(STORE, store)

const comp = computed(() => {
  const hasContent = store.items.length > 0
  if (hasContent) return ContentArea
  return ImportArea
})

const loading = ref(false)
function handleSave() {
  loading.value = true

  store.items.forEach(item => {
    if (!item.code) return
    item.code = item.code
      .trim()
      .split('\n')
      .join('<br>')
  })

  batchUpdateOrder(store.items)
    .then(() => {
      iStore.selectedOrders = []
      store.items = []
      toast.success('保存成功')
    })
    .finally(() => loading.value = false)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <section class="flex justify-between items-center p-6">
      <div>
        <h2 class="text-2xl font-bold">批量编辑订单</h2>
        <p class="text-sm text-muted-foreground mt-1">
          人工服务，批量编辑订单信息
        </p>
      </div>

      <XButton
        v-show="store.items.length > 0"
        label="保存修改"
        icon="lucide:save"
        :loading="loading"
        @click="handleSave"
      />
    </section>

    <Transition name="fade" mode="out-in">
      <component :is="comp" />
    </Transition>
  </div>
</template>
