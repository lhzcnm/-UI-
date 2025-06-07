<script setup lang="ts">
import ImportArea from './components/ImportArea.vue'
import { STORE, type OrderEditStore } from './utils'

const store: OrderEditStore = reactive({
  isCode: false,
  serviceId: undefined,
  status: undefined,
  items: [],
})

provide(STORE, store)

const comp = computed(() => {
  const hasContent = store.items.length > 0
  if (hasContent) return ImportArea
  return ImportArea
})
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
    </section>

    <Transition name="fade" mode="out-in">
      <component :is="comp" />
    </Transition>
  </div>
</template>
