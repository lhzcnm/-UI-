<script setup lang="ts">
import TheModal from '@mobile/components/TheModal.vue'
import { Icon } from '@iconify/vue'

import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'

import { SERVICE_STORE } from '../utils'
import type { PayType } from '../utils/types'


interface QrcodeProps {
  payType: PayType
}

const { payType } = defineProps<QrcodeProps>()

const store = inject(SERVICE_STORE)!

const { t } = useI18n()

const text = ref<string>("")
const qrcode = useQRCode(text)

watch(
  () => store.visiblePay,
  (visible) => {
    if(!visible) {
      store.url = ""
      return
    }

    text.value = store.url
    console.log(text.value)
    console.log(qrcode)
  }
)

const isWechat = computed(() => {
  return payType === 'wxpay'
})
</script>

<template>
  <TheModal
    :title="t('shop.pay.qrcode')"
    class="z-[50] h-[50%]"
    v-model="store.visiblePay">
    <div class="flex-1 overflow-y-auto flex flex-col justify-center items-center space-y-6">
      <div class="flex justify-center items-center space-x-2">
        <Icon class="size-12 text-success" icon="ri:wechat-pay-fill" v-if="isWechat" />
        <Icon class="size-12 text-primary" icon="ri:alipay-fill" v-else />
        <span class="text-2xl font-semibold">{{  isWechat ? t('shop.pay.wx') : t('shop.pay.ali') }}</span>
      </div>
      <div class="border rounded-md overflow-hidden relative">
        <img :src="qrcode" alt="qrcode" />
      </div>
    </div>
  </TheModal>
</template>
