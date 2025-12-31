<script setup lang="ts">
import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { QUOTATION_SCHEMA_MAP, type QuotationItem } from '@/utils/quotation'
import { QUOTATION_STORE } from '../utils'
import { deleteQuotation } from '@/utils/quotation/fn'

interface TableActionProps {
  row: QuotationItem<typeof store.category>
}

const store = inject(QUOTATION_STORE)!

const { row } = defineProps<TableActionProps>()

const options: XBtnSplitOptions = [
  {
    label: '删除',
    icon: 'lucide:trash-2',
    command: handleDelete,
  }
]

function handleEdit() {
  store.formBase = QUOTATION_SCHEMA_MAP[store.category].form.parse(row)
  store.id = row.id
  store.visibleBase = true
}

async function handleDelete() {
  if(!await xconfirm('是否确认删除该数据')) return
  deleteQuotation(store.category, [row.id]).then(() => {
    toast.success('删除成功')
    store.refresh = !store.refresh
  }).catch(() => {
    toast.warning('删除失败')
  })
}
</script>

<template>
  <XButtonSplit
    :options="options"
    size="sm" label="编辑"
    @click="handleEdit"
  />
</template>
