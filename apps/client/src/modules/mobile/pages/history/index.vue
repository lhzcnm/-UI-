<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import OrderExportImg from '@/components/shared/OrderExportImg.vue'
import { twJoin } from 'tailwind-merge'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { orderApi, type Order } from '@/api/orders'
import ImgOrder from './components/ImgOrder.vue'
import type { ImgOrderItem } from './types'
import * as htmlToImage from 'html-to-image'
import { h, render } from 'vue'
import { toast } from 'vue-sonner'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const pageSize = ref(20)
const generated = ref<boolean>(false)

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

// const baseUrl = import.meta.env.VITE_API_URL

provide(HISTORY_STORE, store)

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
  // const service = serviceStore.services.get(order.serviceId)!

  // const params: GeneratePictureParms = {
  //   codeId: order.id.toString(),
  //   code: order.result,
  //   codeStatusId: order.status,
  //   imei: order.imei,
  //   credits: order.credits.toString(),
  //   comments: order.remark,
  //   packageTitle: service.title,
  //   dataTime: order.createTime,
  // }

  // axios.post(`${baseUrl}/order/picture`, params , {
  //   headers: {
  //     'Authorization': localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  //   },
  //   'responseType': 'blob',
  // }).then(({ data }) => {
  //   const blob = new Blob([data], { type: 'image/png' })
  //   const url = URL.createObjectURL(blob)
  //   imgOrder.id = order.id
  //   imgOrder.imei = order.imei
  //   imgOrder.img = url
  // }).finally(() => {
  //   store.visibleImg = true
  // })
  if(generated.value) {
    toast.warning('请勿重复点击')
    return
  }

  generated.value = true

  const container = document.createElement('div')
  document.body.append(container)
  container.className = `opacity-0 flex`

  const vnode = h(OrderExportImg, {
    order,
  })

  render(vnode, container)

  const dom = document.getElementById(`order${order.id}`)!

  htmlToImage.toBlob(dom, {
    cacheBust: true,
    skipFonts: true,
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
        <XButton label="搜索" @click="store.visibleSearch = true" />
        <XButton label="导出" color="success" @click="store.visibleExport = true" />
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
        />
      </template>
    </section>

    <SearchOrder />
    <ExportOrder />
    <ImgOrder :imgOrder @close="handleClose" />
  </div>
</template>
