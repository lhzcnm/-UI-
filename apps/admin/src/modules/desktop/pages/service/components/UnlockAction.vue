<script setup lang="ts">
import { xconfirm } from '@3un/shared/confirm'

import type { Unlock } from '@/inters/services'
import { zUnlockForm } from '@/inters/services'
import { deleteUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

interface FieldActionProps {
  row: Unlock
  index: number
}

const props = defineProps<FieldActionProps>()
const store = inject(UNLOCK_STORE)!

function openUpdate() {
  store.formBase = zUnlockForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该“推荐解锁服务”吗？')) return

  deleteUnlock(props.row.id).then(() => {
    store.unlocks.splice(props.index, 1)
  })
}
</script>

<template>
  <XButton icon="lucide:edit" size="sm" label="编辑" class="mr-2" @click="openUpdate" />
  <XButton icon="lucide:trash" size="sm" color="danger" label="删除" @click="handleDelete" />
</template>
