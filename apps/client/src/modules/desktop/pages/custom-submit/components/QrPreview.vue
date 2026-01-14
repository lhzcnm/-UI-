<script setup lang="ts">
import { mmToPx } from '@/utils';
import { useQRCode } from '@vueuse/integrations/useQRCode.mjs'

interface QrPreviewProps {
  data: string,
  size: number,
}

const props = defineProps<QrPreviewProps>()

const qrCode = useQRCode(computed(() => props.data || ""))

const pxSize = computed(() => mmToPx(props.size))
</script>

<template>
  <img :src="qrCode" alt=""
    :style="{
      width: pxSize + 'px',
      height: pxSize + 'px',
    }" />
</template>
