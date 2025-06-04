<script setup lang="ts">
import type { CustomMsg } from '@/inters/wechat'
import { zCustomMsgForm } from '@/inters/wechat'
import { deleteCustomMsg } from '@/api/wechat'
import { MSG_STORE } from '../utils'
import { xconfirm } from '@3un/utils'

interface MsgActionProps {
  row: CustomMsg
  index: number
}

const props = defineProps<MsgActionProps>()
const store = inject(MSG_STORE)!

function openUpdate() {
  store.formBase = zCustomMsgForm.parse(props.row)
  store.visibleBase = true
  store.index = props.index
}

async function openDelete() {
  if (await xconfirm('确定删除该消息吗？')) {
    await deleteCustomMsg(props.row.id)
    store.msgList.splice(props.index, 1)
  }
}
</script>

<template>
  <div class="space-x-2">
    <XButton
      icon="lucide:edit" size="sm" label="编辑"
      @click="openUpdate"
    />
    <XButton
      icon="lucide:trash" color="danger" size="sm" label="删除"
      @click="openDelete"
    />
  </div>
</template>
