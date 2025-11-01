<script setup lang="ts">
import PayMethod from '@mobile/pages/store/components/service/PayMethod.vue'

import type { DetailStepEmits, PayMethodType } from '@mobile/pages/store/utils/types'
import { SERVICE_STORE } from '@mobile/pages/store/utils/symbol'
import type { StorePayParams } from '@/api/store/types'
import { storePay } from '@/api/store'
import { ua } from '@3un/utils'
import { toast } from 'vue-sonner'

const store = inject(SERVICE_STORE)!

const payType = ref<PayMethodType>('wxpay')

const emits = defineEmits<DetailStepEmits>()

const service = store.selService!

const validImeis = computed(() => {
  let res = ''

  if(store.createOrder.imeiList.length >= 0) {
    res = store.createOrder.imeiList.join('\n')
  }

  return res
})

const amount = computed(() => {
  return +service.storePrice * store.createOrder.imeiList.length
})

function handleConfirm() {
  handlePay()
}

function handlePay() {
  const params: StorePayParams = {
    id: '3',
    amount: amount.value,
    type: payType.value,
  }
  
  storePay(params).then(({ data }) => {
    if(payType.value === 'wxpay') {
      if(ua.isWechat) {
        location.href = data
      }
    } else if(payType.value === 'alipay') {
      const a = document.createElement('a')
      a.href = data
      a.target = '_blank'
      a.click()
      a.remove()
    }


  }).catch(() => {
    return toast.error('生成支付二维码失败')
  })
}

// async function handleImport() {
  
// }
</script>

<template>
  <div
    class="flex flex-col space-y-6 p-6 rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-sm dark:shadow-zinc-800 transition-all duration-300"
  >
    <div class="flex flex-col space-y-2">
      <span class="text-base font-medium text-zinc-800 dark:text-zinc-200">
        有效 IMEI 数量: 
        <span class="font-semibold text-primary">{{ store.createOrder.imeiList.length }}</span>
      </span>
      <div
        class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-line"
      >
        {{ validImeis }}
      </div>
    </div>

    <PayMethod v-model="payType" />

    <div class="flex flex-col border-t border-border pt-4 space-y-2">
      <div class="flex justify-between items-center text-lg text-zinc-700 dark:text-zinc-300">
        <span>单次服务价格</span>
        <span class="font-semibold text-primary">￥{{ service.storePrice }}</span>
      </div>
      <div class="flex justify-between items-center text-lg text-zinc-800 dark:text-white">
        <span>总价格</span>
        <span class="text-2xl font-bold text-primary">￥{{ amount }}</span>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <XButton
        :disabled="store.submited"
        variant="outline"
        label="上一步"
        class="px-6"
        @click.prevent="emits('prev', 'order')"
      />
      <XButton
        :disabled="store.submited"
        label="确认"
        class="px-6"
        @click.prevent="handleConfirm"
      />
    </div>
  </div>
</template>
