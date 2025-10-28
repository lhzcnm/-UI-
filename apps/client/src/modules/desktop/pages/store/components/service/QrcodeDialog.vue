<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'

import { Icon } from '@iconify/vue'

import { SERVICE_STORE } from '../../utils/symbol'

const store = inject(SERVICE_STORE)!

const text = ref<string>('')

const qrcode = useQRCode(text)

watch(
  () => store.visibleQrcode,
  () => {
    if(!store.visibleQrcode) {
      store.url = ''
      return
    }
    text.value = store.url
  }
)
</script>

<template>
  <XDialog
    v-model="store.visibleQrcode"
    :mask-closable="false"
  >
    <template #default>
      <div class="flex flex-col justify-center">
        <template v-if="store.payType === 'wxpay'">
          <div class="flex justify-center items-center space-x-2">
            <Icon class="size-9 text-success" icon="ri:wechat-pay-fill" />
            <span class="text-2xl font-semibold">微信支付</span>
          </div>
        </template>
        <template v-if="store.payType === 'alipay'">
          <div class="flex justify-center items-center">
            <Icon class="size-9 text-primary" icon="ri:alipay-fill" />
            <span class="text-2xl font-semibold">支付宝</span>
          </div>
        </template>
        <img :src="qrcode" alt="">
      </div>
    </template>
  </XDialog>
</template>
