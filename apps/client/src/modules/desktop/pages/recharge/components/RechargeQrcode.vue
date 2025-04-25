<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { twJoin } from 'tailwind-merge'
import { Icon } from '@iconify/vue'

import { formatTime } from '@3un/utils'
import { RECHARGE_STORE } from '../utils'

const store = inject(RECHARGE_STORE)!

const text = ref('')
const isExpired = ref(false)
const countdown = ref(7200)
const qrcode = useQRCode(text)
let timer = 0

watch(
  () => store.visible,
  (newValue) => {
    if (!newValue) {
      console.log('close')
      handleClose()
      return
    }

    text.value = store.url
    isExpired.value = false
    countdown.value = 7200
    startCountdown()
  }
)

onUnmounted(() => handleClose())

function startCountdown() {
  clearInterval(timer)

  timer = window.setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      isExpired.value = true
      handleClose()
    }
  }, 1000)
}

function handleClose() {
  clearInterval(store.timer)
  clearInterval(timer)
  timer = 0
}
</script>

<template>
  <XDialog 
    v-model="store.visible" 
    :interact="store.isComplete"
  >
    <button
      class="absolute top-2 right-2"
      :class="twJoin(
        'bg-muted rounded-full p-1 text-muted-foreground',
        'hover:bg-muted-foreground/10 hover:rotate-90',
        'transition-all duration-200',
      )"
      @click="store.visible = false"
    >
      <Icon icon="lucide:x" />
    </button>
    <Transition mode="out-in" class="fade-in-scale">
      <div v-if="!store.isComplete" class="flex flex-col items-center justify-center space-y-4 p-4">
        <div class="flex space-x-1 items-center">
          <Icon icon="ri:wechat-pay-fill" class="size-9 text-success" />
          <div class="text-2xl font-medium">微信支付</div>
        </div>

        <div
          class="size-40 border rounded-md overflow-hidden relative"
          :class="{ 'opacity-50': isExpired }"
        >
          <img class="size-full qrcode" :src="qrcode" alt="QrCode">
          <div 
            v-if="isExpired"
            :class="twJoin(
              'absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-card',
              'text-center text-sm',
            )"
          >
            二维码已过期
          </div>
        </div>

        <div class="text-center text-sm text-muted-foreground">
          <div v-if="!isExpired">二维码有效期：{{ formatTime(countdown) }}</div>
          <div>请使用微信扫码完成支付</div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center space-y-4 p-8">
        <div class="relative">
          <Icon 
            icon="ri:checkbox-circle-fill" 
            class="size-16 text-success animate-scale-check"
          />
          <div class="absolute top-0 bottom-0 left-0 right-0 size-16 rounded-full border-4 border-success animate-circle-expand" />
        </div>
        <div class="text-xl font-medium text-success opacity-0 animate-fade-up">支付成功</div>
      </div>
    </Transition>
  </XDialog>
</template>
