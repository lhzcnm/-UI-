<script setup lang="ts">
import { toast } from 'vue-sonner'

import type { XBtnSplitOptions } from '@3un/ui'

import { REMARK_STORE } from '../utils'
import { zRemarkForm, type Remark } from '@/inters/quotation/remark'
import { xconfirm } from '@3un/utils'
import { deleteRemark } from '@/api/quotation'

interface TableActionProps {
  row: Remark,
}

const store = inject(REMARK_STORE)!

const { row } = defineProps<TableActionProps>()

const options: XBtnSplitOptions = [
  {
    label: '删除',
    icon: 'lucide:trash-2',
    command: handleDelete,
  }
]

function openEdit() {
  store.formBase = zRemarkForm.parse(row)
  store.id = row.id
  store.visibleBase = true
}

async function handleDelete() {
  if(!await xconfirm('是否确认删除')) return

  deleteRemark([row.id]).then(() => {
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
    @click="openEdit"
  />
</template>
