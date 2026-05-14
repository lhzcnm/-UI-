<script setup lang="ts">
import { mmToPt, mmToPx } from '@/utils'
import JsBarcode from 'jsbarcode'

interface BarcodePreviewProps {
  data: string,
  size: number,
  showField: boolean,
  moduleWidthPx: number,
}

const props = defineProps<BarcodePreviewProps>()

const barcodeRef = ref<SVGElement | null>()

watch(
  [() => props.data, () => props.size, () => props.showField, () => props.moduleWidthPx],
  () => renderBarcode()
)

function renderBarcode() {
  if (!barcodeRef.value) return

  JsBarcode(barcodeRef.value, props.data, {
    format: "CODE128",
    width: props.moduleWidthPx,
    height: mmToPx(props.size),
    displayValue: props.showField,
    fontSize: mmToPt(props.size * 0.5),
    margin: 0,
  })
}

onMounted(() => {
  renderBarcode()
})
</script>

<template>
  <svg ref="barcodeRef"></svg>
</template>
