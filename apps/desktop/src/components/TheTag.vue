<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'
import type { XTagProps } from '@3un/ui'

interface TheTagProps {
  params: ICellRendererParams & XTagProps
}

defineProps<TheTagProps>()
</script>

<template>
  <XTag
    :color="params.color"
    :shape="params.shape"
    :label="params.label"
  />
</template>
