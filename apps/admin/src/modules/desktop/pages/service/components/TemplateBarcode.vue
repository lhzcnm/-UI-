<script setup lang="ts">
import { mmToPx } from '@/utils'
import JsBarcode from 'jsbarcode'

interface BarcodePreviewProps {
  data: string,
  size: number,
}

const props = defineProps<BarcodePreviewProps>()

const barcodeRef = ref<SVGElement | null>()

watch(
  [() => props.data, () => props.size],
  () => renderBarcode()
)

function renderBarcode() {
  if (!barcodeRef.value) return

  JsBarcode(barcodeRef.value, props.data, {
    format: "CODE128",
    width: mmToPx(props.size * 0.06),
    height: mmToPx(props.size * 1.2),
    displayValue: true,
    fontSize: mmToPx(props.size),
  })
}

onMounted(() => {
  renderBarcode()
})
</script>

<template>
  <svg ref="barcodeRef"></svg>
</template>
