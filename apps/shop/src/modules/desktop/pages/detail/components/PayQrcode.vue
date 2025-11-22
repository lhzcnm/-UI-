<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'
import { formatTime } from '@3un/utils'
import { DETAIL_STORE } from '../utils'

const store = inject(DETAIL_STORE)!
const { t } = useI18n()

const text = ref('')
const countdown = ref(7200)
const isExpired = ref(false)

const qrcode = useQRCode(text)

let timer: number | null = null

watch(
  () => store.visibleQrcode,
  (visible) => {
    if (!visible) {
      stopTimer()
      store.url = ''
      return
    }

    text.value = store.url
    countdown.value = 7200
    isExpired.value = false

    startTimer()
  }
)

const isWechat = computed(() => {
  return store.payType === 'wxpay'
})

function startTimer() {
  stopTimer()

  timer = window.setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      isExpired.value = true
      handleClose()
    }
  }, 1000)
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function handleClose() {
  stopTimer()
  store.visibleQrcode = false
}

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <XDialog
    v-model="store.visibleQrcode"
    :mask-closable="false"
    ui-header="mb-5"
  >
    <div class="flex flex-col justify-center items-center space-y-6">
      <div class="flex justify-center items-center space-x-2">
        <Icon class="size-12 text-success" icon="ri:wechat-pay-fill" v-if="isWechat" />
        <Icon class="size-12 text-primary" icon="ri:alipay-fill" v-else />
        <span class="text-2xl font-semibold">{{  isWechat ? t('shop.pay.wx') : t('shop.pay.ali') }}</span>
      </div>

      <div class="border rounded-md overflow-hidden relative">
        <img :src="qrcode" alt="qrcode">
      </div>

      <div class="text-center text-sm text-muted-foreground">
        <div v-if="!isExpired">
          {{ t('recharge.qrcode.validity') }}: {{ formatTime(countdown) }}
        </div>
        <div>{{ t('recharge.qrcode.text') }}</div>
      </div>
    </div>
  </XDialog>
</template>
