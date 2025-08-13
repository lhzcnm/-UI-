<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'

import { useClipboard } from '@vueuse/core'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { columns } from './utils/columns'
import { orderApi } from '@/api/orders'
import { toast } from 'vue-sonner'
import axios from 'axios'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const limit = ref(20)

const selectRows = ref<string[]>([])
const { copy } = useClipboard({ legacy: true })

const baseUrl = import.meta.env.VITE_API_URL

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false
})

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

  copy(selectRows.value.join('\n'))
  toast.success('已复制到剪贴板')
}

async function handlePrint() {
  const params: string[] = []
  params.length = 0
  
  if(selectRows.value.length === 0) {
    toast.warning('请选择订单后重试')
    return
  }

  for(const index of selectRows.value) {
    const filters = store.orders.list.filter(item => item.imei === index).map(item => item.result)
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
      'responseType': 'arraybuffer',
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
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <XButton label="搜索" @click="openSearch" />
        <XButton color="success" label="导出" @click="openExport" />
        <XButton color="warning" label="打印结果" @click="handlePrint" />
        <XButton variant="soft" label="复制 IMEI" @click="handleCopy" />
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
      selected-key="imei" selection
      class="h-[calc(100%-3rem)] border"
      @select-change="selectRows = $event"
    />

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
