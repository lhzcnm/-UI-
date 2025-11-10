<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import ImgOrder from './components/ImgOrder.vue'
import OrderVoucher from '@/components/shared/OrderVoucher.vue'

import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import axios from 'axios'
import { h, render } from 'vue'
import * as html2image from 'html-to-image'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { getOrderColumns } from './utils/columns'
import { orderApi, type Order, type OrderExportParams } from '@/api/orders'
import type { ImgOrderItem } from './types'
import OrderExportImgZh from '@/components/shared/OrderExportImgZh.vue'
import OrderExportImgEn from '@/components/shared/OrderExportImgEn.vue'
import { downloadURL, ORDER_STATUS } from '@3un/utils'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const limit = ref(20)

const selectRows = ref<string[]>([])
const generated = ref<boolean>(false)

const { copy } = useClipboard({ legacy: true })
const { t, locale } = useI18n()

const baseUrl = import.meta.env.VITE_API_URL

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
  visibleOrderImg: false,
})

const imgOrders = reactive<ImgOrderItem[]>([])

provide(HISTORY_STORE, store)

const loading = ref(false)

const columns = getOrderColumns()

watch(
  [page, limit],
  async ([pageVal, pageSizeVal]) => {
    loading.value = true

    const params = formatOrderParams(store.searchForm)
    const response = await orderApi.list({
      pageSize: pageSizeVal,
      page: pageVal,
      ...params,
    })
    store.orders = response.data
    loading.value = false
  },
  { immediate: true }
)

watch(
  () => selectRows.value,
  () => {
    console.log(selectRows)
  }
)

function openSearch() {
  store.visibleSearch = true
}

function openExport() {
  if(selectRows.value.length > 0) {
    handleExport()
    return
  }

  store.exportForm = { ...form.export }
  store.visibleExport = true
}

function handleCopy() {
  if (selectRows.value.length === 0) {
    toast.warning(t('order.prompt.order'))
    return
  }

  const res: string[] = []

  for(let id of selectRows.value) {
    const order = store.orders.list.find(item => item.id === +id)!
    res.push(order.imei)
  }

  copy(res.join('\n'))
  toast.success(t('order.prompt.copy'))
}

async function handlePrint() {
  const params: string[] = []
  params.length = 0
  
  if(selectRows.value.length === 0) {
    toast.warning(t('order.prompt.order'))
    return
  }

  for(const id of selectRows.value) {
    const filters = store.orders.list.filter(item => item.id === +id).map(item => item.result)
    params.push(...filters)
  }

  try {
    const { data } = await axios.post(`${baseUrl}/order/print`, params, {
      headers: {
        'Authorization': localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      },
      'responseType': 'blob',
    })
  
    const blob = new Blob([data], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(blob)
    handleOpenWindow(pdfUrl)

  } catch(e) {
    console.log(e)
  }
}

function handleOpenWindow(url: string) {
  const openWindow = window.open(url, '_blank')
    openWindow!.onload = () => {
      try {
        setTimeout(() => {
          openWindow!.print()
          openWindow!.onbeforeunload = () => {
            URL.revokeObjectURL(url)
          }
        }, 1000)
      } catch (err) {
        URL.revokeObjectURL(url)
      }
    }
}

function handleGenerate() {
  handleClose()
  imgOrders.length = 0

  if(selectRows.value.length === 0) {
    toast.warning(t('order.prompt.order'))
    return
  }

  const orders: Order[] = []
  generated.value = true

  for(let id of selectRows.value) {
    const order = store.orders.list.find(item => item.id === +id)!
    orders.push(order)
  }

  for(let order of orders) {
    if(order.status === ORDER_STATUS.FAILED) {
      continue
    }
    const container = document.createElement('div')
    document.body.append(container)
    // container.className = `opacity-0 flex`
    container.className = `flex`

    const vnode = h(OrderVoucher, { order, component: locale.value === 'zh' ? OrderExportImgZh : OrderExportImgEn })

    render(vnode, container)

    const dom = document.getElementById(`order${order.id}`)!

    html2image.toBlob(dom, {
      cacheBust: true,
      skipFonts: true,
    }).then((blob: Blob | null) => {
      const url = URL.createObjectURL(blob!)
      imgOrders.push({
        id: order.id,
        imei: order.imei,
        img: url,
      })
    }).finally(() => {
      store.visibleOrderImg = true
      render(null, container)
      container.remove()
      generated.value = false
    })
  }
}

function handleClose() {
  store.visibleOrderImg = false

  for(const order of imgOrders) {
    URL.revokeObjectURL(order.img)
  }
}

function handleExport() {
  console.log(selectRows.value)
  const orderId = selectRows.value[0]
  const index = store.orders.list.findIndex(item => item.id === +orderId)

  if(index === -1) {
    selectRows.value.length = 0
    openExport()
  }

  const order = store.orders.list[index]
  const params: OrderExportParams = {
    serviceId: order.serviceId,
    orderIdList: [order.id.toString()],
  }
  orderApi.export(params).then(({ data }) => {
    downloadURL(data)
  })
}

onUnmounted(() => {
  handleClose()
})
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <ButtonGroup
          :layouts="['filter', 'export']"
          @filter="openSearch" @export="openExport"
        />
        <XButton color="warning" :label="t('order.button.print')" @click="handlePrint" />
        <XButton variant="soft" :label="`${t('button.copy')} IMEI`" @click="handleCopy" />
        <XButton variant="soft" color="success" :label="t('order.button.generate')" :disabled="generated" @click="handleGenerate" />
      </div>

      <XPagination
        v-model="page"
        v-model:limit="limit"
        :total="store.orders.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>

    <XTable
      :data="store.orders.list"
      :columns="columns"
      :loading="loading"
      row-key="id"
      selected-key="id" selection
      class="h-[calc(100%-3rem)] border"
      @select-change="selectRows = $event"
    />

    <SearchOrder />
    <ExportOrder />
    <ImgOrder :imgOrders="imgOrders" @close="handleClose" />
  </div>
</template>
