<script setup lang="ts">
import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { Quotation } from '@/inters/quotation'
import { OLD_QUOTATION_STORE } from '../utils'
import { deleteOldQuotations } from '@/api/quotation'

interface TableActionProps {
  row: Quotation,
}

const props = defineProps<TableActionProps>()
const store = inject(OLD_QUOTATION_STORE)!

const options: XBtnSplitOptions = [
  {
    icon: 'lucide:trash-2',
    label: '删除',
    command: handleDelete
  }
]

function handleEmit() {
  store.visibleEmit = true
}

async function handleDelete() {
  if(!await xconfirm('确定删除该报价单')) return

  try {
    await deleteOldQuotations([props.row.id])
    const index = store.quotations.list.findIndex(item => item.id === props.row.id)
    if(index !== -1) {
      store.quotations.list.splice(index, 1)
    }

    return toast.success('删除成功')
  } catch {
    return toast.error('删除失败')
  }
}
</script>

<template>
  <XButtonSplit
    size="sm"
    label="编辑"
    :options="options"
    @click="handleEmit"
  />
</template>
