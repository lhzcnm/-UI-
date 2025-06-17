<script setup lang="ts">
import { xconfirm } from '@3un/utils'

import type { Recharge } from '@/inters/recharge'
import { deleteRecharges } from '@/api/recharge'
import { RECHARGE_STORE } from '../utils'

interface RechargeActionProps {
  row: Recharge
  index: number
}

const props = defineProps<RechargeActionProps>()
const store = inject(RECHARGE_STORE)!

function openUpdate() {
  store.formUpdate = {
    userId: props.row.userId,
    paymentId: props.row.paymentId,
    paymentStatus: props.row.paymentStatus,
    paymentMethod: props.row.paymentMethod,
    comments: props.row.comments || undefined,
    byAdmin: props.row.byAdmin,
  }

  store.visibleUpdate = true
  store.index = props.index
}

async function handleDelete() {
  if (!await xconfirm('确定删除该记录吗？')) return

  deleteRecharges([props.row.paymentId]).then(() => {
    store.recharges.list.splice(props.index, 1)
    store.recharges.total--
  })
}
</script>

<template>
  <div class="space-x-2">
    <XButton icon="lucide:edit" size="sm" label="编辑" @click="openUpdate" />
    <XButton icon="lucide:trash-2" size="sm" color="danger" label="删除" @click="handleDelete" />
  </div>
</template>
