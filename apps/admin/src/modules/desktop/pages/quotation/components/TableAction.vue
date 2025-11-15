<script setup lang="ts">
import type { XBtnSplitOptions } from '@3un/ui'
import { QUOTATION_STORE, type QuotationItem } from '../utils'
import { xconfirm } from '@3un/utils'

interface TableActionProps {
  row: QuotationItem<typeof store.category>
}

const store = inject(QUOTATION_STORE)!

defineProps<TableActionProps>()

const options: XBtnSplitOptions = [
  {
    label: '删除',
    icon: 'lucide:trash-2',
    command: handleDelete,
  }
]

function handleEdit() {
  store.visibleBase = true
}

async function handleDelete() {
  if(!await xconfirm('是否确认删除该数据')) return
}
</script>

<template>
  <XButtonSplit
    :options="options"
    size="sm" label="编辑"
    @click="handleEdit"
  />
</template>
