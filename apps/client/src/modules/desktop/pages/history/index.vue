<script setup lang="ts">
import HistoryView from './views/HistoryView.vue'
import PrintView from './views/PrintView.vue'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form } from './utils'
import type { ImgOrderItem } from './types'

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
  visibleOrderImg: false,
  visiblePrint: false,
  visibleUnlockRecommend: false,
  paperSize: {
    labelWidth: '',
    labelHeight: '',
  },

  views: 'history',
  selectOrders: [],

  index: undefined,
})

const imgOrders = reactive<ImgOrderItem[]>([])

provide(HISTORY_STORE, store)

const route = useRoute()

const val = route.query.codeId
const codeIds: string[] = (Array.isArray(val) ? val : val ? [val] : []).filter((v): v is string => v !== null)

if (codeIds.length > 0) {
  store.searchForm.codeIds = codeIds.join('\n')
}

function handleClose() {
  store.visibleOrderImg = false

  for(const order of imgOrders) {
    URL.revokeObjectURL(order.img)
  }
}

const components: Record<string, Component> = {
  history: HistoryView,
  print: PrintView,
}

const serviceStore = useServiceStore()
await serviceStore.getServices()

onUnmounted(() => {
  handleClose()
})
</script>

<template>
  <Transition name="fade-in">
    <component :is="components[store.views]" />
  </Transition>
</template>
