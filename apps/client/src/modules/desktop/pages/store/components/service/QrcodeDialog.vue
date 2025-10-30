<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'
import { formatTime } from '@3un/utils'

import { SERVICE_STORE } from '@desktop/pages/store/utils/symbol'

const store = inject(SERVICE_STORE)!

const text = ref<string>('')
const countdown = ref(7200)
const isExpired = ref<boolean>(false)

const qrcode = useQRCode(text)
const { t } = useI18n()

let timer: number = 0

watch(
  () => store.visibleQrcode,
  () => {
    if(!store.visibleQrcode) {
      store.url = ''
      return
    }
    text.value = store.url
    countdown.value = 7200
    isExpired.value = false
    setCountDown()
  }
)

function setCountDown() {
  clearInterval(timer)

  setInterval(() => {
    countdown.value--

    if(countdown.value <= 0) {
      handleClose()
    }
  }, 1000)
}

function handleClose() {
  clearInterval(timer)
  timer = 0
}

onUnmounted(() => {
  handleClose()
})
</script>

<template>
  <XDialog
    v-model="store.visibleQrcode"
    :mask-closable="false"
    ui-header="mb-5"
  >
    <template #default>
      <div class="flex flex-col justify-center items-center space-y-6">
        <div class="flex justify-center items-center space-x-2">
          <Icon class="size-12 text-success" icon="ri:wechat-pay-fill" />
          <span class="text-2xl font-semibold">微信支付</span>
        </div>
        <div class="border rounded-md overflow-hidden relative">
          <img :src="qrcode" alt="">
        </div>
        <div class="text-center text-sm text-muted-foreground">
          <div v-if="!isExpired">{{ t('recharge.qrcode.validity') }}: {{ formatTime(countdown) }}</div>
          <div>{{ t('recharge.qrcode.text') }}</div>
        </div>
      </div>
    </template>
  </XDialog>
</template>
