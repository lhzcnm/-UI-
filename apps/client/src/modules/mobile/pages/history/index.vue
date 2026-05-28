<script setup lang="ts">
import ImgOrder from './components/ImgOrder.vue'
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import OrderVoucher from '@/components/shared/OrderVoucher.vue'
import OrderExportImgZh from '@/components/shared/OrderExportImgZh.vue'
import OrderExportImgEn from '@/components/shared/OrderExportImgEn.vue'

import { twJoin } from 'tailwind-merge'
import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { orderApi, type Order } from '@/api/orders'
import type { ImgOrderItem } from './types'
import * as html2Image from 'html-to-image'
import { h, render } from 'vue'
import { toast } from 'vue-sonner'
// import { downloadURL } from '@3un/utils'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const pageSize = ref(20)
const generated = ref<boolean>(false)

const { locale } = useI18n()

const mainNode = document.getElementById('main')

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
  visibleImg: false,
})

const imgOrder = reactive<ImgOrderItem>({
  img: '',
  id: 0,
  imei: '',
})

provide(HISTORY_STORE, store)

const route = useRoute()

const val = route.query.codeId
const codeIds: string[] = (Array.isArray(val) ? val : val ? [val] : []).filter((v): v is string => v !== null)

if (codeIds.length > 0) {
  store.searchForm.codeIds = codeIds.join('\n')
}

watch(
  page,
  async (pageVal) => {
    const params = formatOrderParams(store.searchForm)

    const response = await orderApi.list({
      serviceId: store.searchForm.serviceId || undefined,
      pageSize: pageSize.value,
      page: pageVal,
      ...params,
    })

    mainNode?.scrollTo({ top: 0, behavior: 'smooth' })
    store.orders = response.data
  },
  { immediate: true },
)

function handleGenerate(order: Order) {
  if(generated.value) {
    toast.warning('请勿重复点击')
    return
  }

  generated.value = true

  const container = document.createElement('div')
  document.body.append(container)
  container.className = `opacity-0 flex`

  const vnode = h(OrderVoucher, { order, component: locale.value === 'zh' ? OrderExportImgZh : OrderExportImgEn })

  render(vnode, container)

  const dom = document.getElementById(`order${order.id}`)!

  html2Image.toBlob(dom, {
    cacheBust: true,
    skipFonts: true,
    pixelRatio: 2,
  }).then((blob: Blob | null) => {
    const url = URL.createObjectURL(blob!)
    imgOrder.id = order.id
    imgOrder.imei = order.imei
    imgOrder.img = url
  }).finally(() => {
    store.visibleImg = true
    render(null, container)
    container.remove()
    generated.value = false
  })
}

function handleClose() {
  URL.revokeObjectURL(imgOrder.img)
}

// function openExport() {
//   const firstOrder = store.orders.list[0]
//   if (isSameService(firstOrder)) {
//     handleExport(firstOrder.serviceId, store.orders.list.map(o => o.id.toString()))
//     return
//   }
//   store.visibleExport = true
// }

// function handleExport(serviceId: number, orderIds: string[]) {
//   const params: OrderExportParams = {
//     serviceId: serviceId,
//     orderIdList: orderIds,
//   }
//   orderApi.export(params).then(({ data }) => {
//     downloadURL(data)
//   })
// }

// function isSameService(firstOrder: Order) {
//   if (store.orders.total === 0) return false
//   return store.orders.list.every(o => o.serviceId === firstOrder.serviceId)
// }

function handleRefresh(order: Order, respOrder: Order) {
  const index = store.orders.list.findIndex(o => o.id === order.id)
  if (index === -1) return

  store.orders.list[index] = {
    ...store.orders.list[index],
    ...respOrder,
  }
}

onUnmounted(() => {
  handleClose()
})
</script>

<template>
  <div class="p-3">
    <section
      :class="twJoin(
        'sticky top-1 z-10',
        'flex items-center justify-between',
        'bg-card border rounded-lg p-3',
      )"
    >
      <div class="space-x-2">
        <ButtonGroup
          :layouts="['filter', 'export']"
          @filter="store.visibleSearch = true" @export="store.visibleExport = true"
        />
      </div>

      <XSimplePagination
        v-model="page"
        :page-size="pageSize"
        :total="store.orders.total"
      />
    </section>

    <section class="mt-2 flex flex-col gap-2">
      <NoMessage
        v-if="store.orders.list.length === 0"
        class="bg-card border rounded-lg p-3"
      />
      <template v-else>
        <OrderCard
          v-for="order in store.orders.list"
          :key="order.id" :order="order"
          @generate="handleGenerate"
          @refresh="handleRefresh"
        />
      </template>
    </section>

    <SearchOrder />
    <ExportOrder />
    <ImgOrder :imgOrder @close="handleClose" />
  </div>
</template>
