<script setup lang="ts">
import OrderVoucher from '@/components/shared/OrderVoucher.vue'
import OrderExportImgZh from '@/components/shared/OrderExportImgZh.vue'
import OrderExportImgEn from '@/components/shared/OrderExportImgEn.vue'

import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import * as html2image from 'html-to-image'
import { h, render } from 'vue'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'

const route = useRoute()
const router = useRouter()

const order = ref<Order>()
const loading = ref(true)
const generated = ref(false)
const orderImg = ref<string>('')

const store = useSettingStore()
const serviceStore = useServiceStore()
const codeId = Number(route.query.codeId)

const { t, locale } = useI18n()

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

function handleGenerate(order: Order) {
  if(generated.value) {
    return toast.warning('请勿重复生成')
  }

  const container = document.createElement('div')
  document.body.append(container)
  container.className = `opacity-0 flex`

  const vnode = h(OrderVoucher, {
    order,
    component: locale.value === 'zh' ? OrderExportImgZh : OrderExportImgEn,
  })

  render(vnode, container)

  const dom = document.getElementById(`order${order.id}`)!

  html2image.toBlob(dom, {
    cacheBust: true,
    skipFonts: true,
    pixelRatio: 2,
  }).then((blob: Blob | null) => {
    const url = URL.createObjectURL(blob!)
    orderImg.value = url
    toast.success(t('order.prompt.info'))
    generated.value = true
  }).finally(() => {
    render(null, container)
    container.remove()
  })
}

function handleDownload() {
  const a = document.createElement('a')

  a.href = orderImg.value
  a.download = `${order.value?.id}_${order.value?.imei}`
  
  a.click()
  a.remove()
}

onUnmounted(() => {
  if(orderImg.value) {
    URL.revokeObjectURL(orderImg.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-zinc-100 dark:bg-black">
    <div class="max-w-xl mx-auto p-3">
      <Fallback v-if="loading" />
  
      <template v-else>
        <OrderCard v-if="order" :order="order" @generate="handleGenerate" />
        <div v-else class="p-8 text-center text-muted-foreground">
          未找到订单信息
        </div>

        <div class="mt-4" v-if="generated" @click="handleDownload">
          <img :src="orderImg" alt="" />
        </div>
        <BaseFooter />
      </template>
    </div>
  </div>
</template>
