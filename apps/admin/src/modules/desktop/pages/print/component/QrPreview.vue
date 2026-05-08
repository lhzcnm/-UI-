<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { mmToPx } from '@/utils'
import QRCode from 'qrcode'

interface QrPreviewProps {
  data: string
  size: number
}

const props = defineProps<QrPreviewProps>()

const moduleCount = ref(0)

watchEffect(async () => {
  if (!props.data) {
    moduleCount.value = 0
    return
  }

  const qr = QRCode.create(props.data, {
    errorCorrectionLevel: 'H',
    // margin: 0,
  })

  moduleCount.value = qr.modules.size
})

const targetPx = computed(() => mmToPx(props.size))

const moduleSize = computed(() => {
  if (!moduleCount.value) return 0
  return Math.floor(targetPx.value / moduleCount.value)
})

const finalPx = computed(() => {
  return moduleSize.value * moduleCount.value
})

const qrCodeUrl = ref('')

watchEffect(async () => {
  if (!props.data || !finalPx.value) {
    qrCodeUrl.value = ''
    return
  }

  qrCodeUrl.value = await QRCode.toDataURL(props.data, {
    errorCorrectionLevel: 'H',
    margin: 0,
    width: finalPx.value,
  })
})
</script>

<template>
  <img
    v-if="qrCodeUrl"
    :src="qrCodeUrl"
    alt="qr"
    :style="{
      width: finalPx + 'px',
      height: finalPx + 'px',
      imageRendering: 'pixelated',
      display: 'block'
    }"
  />
</template>
