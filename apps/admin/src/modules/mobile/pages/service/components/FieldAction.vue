<script setup lang="ts">
import { xconfirm } from '@3un/utils'

import type { ServiceField } from '@/inters/services'
import { zServiceFieldForm } from '@/inters/services'
import { deleteServiceField } from '@/api/services'
import { FIELD_STORE } from '../utils'

interface FieldActionProps {
  row: ServiceField
  index: number
}

const props = defineProps<FieldActionProps>()
const store = inject(FIELD_STORE)!

function openUpdate() {
  store.formBase = zServiceFieldForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该字段吗？')) return

  deleteServiceField([props.row.id]).then(() => {
    store.fields.list.splice(props.index, 1)
    store.fields.total--
  })
}
</script>

<template>
  <XButton icon="lucide:edit" size="sm" label="编辑" @click="openUpdate" />
  <XButton icon="lucide:trash" size="sm" color="danger" label="删除" @click="handleDelete" />
</template>
