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
import { columns } from './utils/columns'
import { orderApi, type Order } from '@/api/orders'
import type { ImgOrderItem } from './types'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const limit = ref(20)

const selectRows = ref<string[]>([])
const generated = ref<boolean>(false)

const { copy } = useClipboard({ legacy: true })

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

function openSearch() {
  store.visibleSearch = true
}

function openExport() {
  store.exportForm = { ...form.export }
  store.visibleExport = true
}

function handleCopy() {
  if (selectRows.value.length === 0) {
    toast.warning('请先选择要复制的行')
    return
  }

  const res: string[] = []

  for(let id of selectRows.value) {
    const order = store.orders.list.find(item => item.id === +id)!
    res.push(order.imei)
  }

  copy(res.join('\n'))
  toast.success('已复制到剪贴板')
}

async function handlePrint() {
  const params: string[] = []
  params.length = 0
  
  if(selectRows.value.length === 0) {
    toast.warning('请选择订单后重试')
    return
  }

  for(const id of selectRows.value) {
    const filters = store.orders.list.filter(item => item.id === +id).map(item => item.result)
    params.push(...filters)
  }

  if(params.length === 0) {
    toast.warning('您选择订单数量为0, 无法操作')
    return
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
        // 添加延迟确保PDF渲染完成
        setTimeout(() => {
          openWindow!.print()
          // 打印后释放URL
          openWindow!.onbeforeunload = () => {
            URL.revokeObjectURL(url)
          }
        }, 1000)
      } catch (err) {
        console.error('打印失败:', err)
        URL.revokeObjectURL(url)
      }
    }
}

function handleGenerate() {
  handleClose()
  imgOrders.length = 0

  if(selectRows.value.length === 0) {
    toast.warning('请选择订单后重试')
    return
  }

  // for(let imei of selectRows.value) {
  //   const order = store.orders.list.find(item => item.imei === imei)!
  //   const service = serviceStore.services.get(order.serviceId)!
  
  //   const params: GeneratePictureParms = {
  //     codeId: order.id.toString(),
  //     code: order.result,
  //     codeStatusId: order!.status,
  //     imei: order.imei,
  //     credits: order.credits.toString(),
  //     comments: order.remark,
  //     packageTitle: service.title,
  //     dataTime: order.createTime,
  //   }
  
  //   axios.post(`${baseUrl}/order/picture`, params, {
  //     headers: {
  //       'Authorization': localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  //     },
  //     'responseType': 'blob',
  //   }).then(({ data }) => {
  //     const blob = new Blob([data], { type: 'image/png' })
  //     const url = URL.createObjectURL(blob)
  //     imgOrders.push({
  //       id: order.id,
  //       imei: order.imei,
  //       img: url,
  //     })
  //   })
  // }

  const orders: Order[] = []
  generated.value = true

  for(let id of selectRows.value) {
    const order = store.orders.list.find(item => item.id === +id)!
    orders.push(order)
  }

  for(let order of orders) {
    const container = document.createElement('div')
    document.body.append(container)
    container.className = `opacity-0 flex`

    const vnode = h(OrderVoucher, { order })

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

onUnmounted(() => {
  handleClose()
})
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <XButton label="搜索" @click="openSearch" />
        <XButton color="success" label="导出" @click="openExport" />
        <XButton color="warning" label="打印结果" @click="handlePrint" />
        <XButton variant="soft" label="复制 IMEI" @click="handleCopy" />
        <XButton variant="soft" color="success" label="生成图片" :disabled="generated" @click="handleGenerate" />
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
