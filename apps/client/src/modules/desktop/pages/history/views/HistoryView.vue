<script setup lang="ts">
import OrderVoucher from '@/components/shared/OrderVoucher.vue'
import SearchOrder from '../components/SearchOrder.vue'
import ExportOrder from '../components/ExportOrder.vue'
import ImgOrder from '../components/ImgOrder.vue'
import PrintDialog from '../components/PrintDialog.vue'
import OrderExportImgZh from '@/components/shared/OrderExportImgZh.vue'
import OrderExportImgEn from '@/components/shared/OrderExportImgEn.vue'

import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'
import { downloadURL, ORDER_STATUS } from '@3un/utils'
import * as html2image from 'html-to-image'
import { h, render } from 'vue'

import { form, formatOrderParams, HISTORY_STORE } from '../utils'
import { getOrderColumns } from '../utils/columns'
import { orderApi, type Order, type OrderExportParams, type OrderPrintParams } from '@/api/orders'
import type { ImgOrderItem } from '../types'

const store = inject(HISTORY_STORE)!

const { copy } = useClipboard({ legacy: true })
const { t, locale } = useI18n()
// const serviceStore = useServiceStore()

const page = ref(1)
const limit = ref(20)
const selectRows = ref<number[]>([])
const generated = ref<boolean>(false)
const loading = ref(false)

const imgOrders = reactive<ImgOrderItem[]>([])

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

function openSearch() {
  store.visibleSearch = true
}

function openExport() {
  if(selectRows.value.length === 1) {
    handleExport()
    return
  }

  store.exportForm = { ...form.export }
  store.visibleExport = true
}

function handleExport() {
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

function handleClose() {
  store.visibleOrderImg = false

  for(const order of imgOrders) {
    URL.revokeObjectURL(order.img)
  }
}

function openPrint() {
  if(selectRows.value.length === 0) {
    return toast.warning(t('order.prompt.order'))
  }
  if (!validServiceUnique(selectRows.value)) {
    return toast.warning('打印结果不允许选择多个服务')
  }

  store.selectOrders = getOrdersyId(selectRows.value)

  if (store.selectOrders.length === 0) {
    return toast.warning('请勿选择处理中或处理失败订单')
  }
  // const service = serviceStore.services.get(store.selectOrders[0].id)

  // if (service?.isUnlock) {
    // store.visiblePrint = true
  // } else {
    store.views = 'print'
  // }
}

function validServiceUnique(ids: number[]) {
  const selectedOrders = store.orders.list.filter(o => ids.includes(o.id))
  const lastServiceId = selectedOrders[selectedOrders.length - 1].serviceId

  return selectedOrders.every( o => o.serviceId === lastServiceId)
}

function getOrdersyId(ids: number[]) {
  return store.orders.list
    .filter(o => o.status === ORDER_STATUS.SUCCESS)
    .filter(o => ids.includes(o.id))
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

async function submitPrint() {
  const body: OrderPrintParams = {
    result: [],
    labelWidth: store.paperSize.labelWidth,
    labelHeight: store.paperSize.labelHeight,
  }

  for(const id of selectRows.value) {
    const filters = store.orders.list.filter(item => item.id === +id).map(item => item.result)
    body.result.push(...filters)
  }

  try {
    const { data } = await orderApi.orderPrint(body)
  
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
        <XButton color="warning" :label="t('order.button.print')" @click="openPrint" />
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
    <PrintDialog @confirm="submitPrint" />
  </div>
</template>
