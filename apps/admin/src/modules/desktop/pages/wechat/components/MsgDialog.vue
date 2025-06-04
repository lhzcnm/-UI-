<script setup lang="ts">
import MsgForm from '@/components/forms/wechat/MsgForm.vue'
import { createCustomMsg, updateCustomMsg } from '@/api/wechat'
import { MSG_STORE } from '../utils'

const store = inject(MSG_STORE)!

async function handleCreate() {
  const msg = await createCustomMsg(store.formBase)
  store.msgList.push(msg)
  store.visibleBase = false
}

async function handleUpdate() {
  const msg = store.msgList[store.index!]
  const body = { ...store.formBase, id: msg.id }

  await updateCustomMsg(body)
  store.msgList[store.index!] = body
  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
  >
    <MsgForm v-model="store.formBase" />
  </FormDialog>
</template>
