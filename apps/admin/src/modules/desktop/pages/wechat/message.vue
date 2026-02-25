<script setup lang="ts">
import MsgDialog from './components/MsgDialog.vue'
import BuilInMsgDialog from './components/BuilInMsgDialog.vue'

import { zCustomMsgForm, zBuiltInMsg } from '@/inters/wechat'
import { getCustomMsgList, getBuiltInMsgList } from '@/api/wechat'

import type { MsgStore } from './utils'
import { MSG_STORE } from './utils'
import { columns } from './utils/columnMsg'

const store: MsgStore = reactive({
  builtInList: [],
  msgList: [],

  formBase: zCustomMsgForm.parse({}),
  formBuiltIn: zBuiltInMsg.parse({}),

  visibleBuiltIn: false,
  visibleBase: false,

  index: undefined,
})

provide(MSG_STORE, store)

await getList()
async function getList() {
  store.msgList = await getCustomMsgList()
  store.builtInList = await getBuiltInMsgList()
}

function openCreate() {
  store.formBase = zCustomMsgForm.parse({})
  store.visibleBase = true
  store.index = undefined
}

function openBuiltIn() {
  store.formBuiltIn = zBuiltInMsg.parse({})
  store.visibleBuiltIn = true
}
</script>

<template>
  <div>
    <section class="space-x-2 p-3 border-b">
      <XButton
        icon="lucide:plus" label="新增"
        @click="openCreate"
      />
      <XButton
        icon="lucide:message-circle"
        label="内置客服消息"
        color="success"
        @click="openBuiltIn"
      />
    </section>

    <div>
      <XTable
        :columns="columns"
        :data="store.msgList"
        class="h-[calc(100vh-8.75rem)]"
        row-key="id"
      />
    </div>

    <MsgDialog />
    <BuilInMsgDialog />
  </div>
</template>
