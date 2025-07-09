<script setup lang="ts">
import MsgCard from './components/MsgCard.vue'
import MsgModal from './components/MsgModal.vue'
import BuilInMsgModal from './components/BuilInMsgModal.vue'

import { zCustomMsgForm, zBuiltInMsg } from '@/inters/wechat'
import { getCustomMsgList, getBuiltInMsgList } from '@/api/wechat'

import type { MsgStore } from './utils'
import { MSG_STORE } from './utils'

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
    <section class="px-3 py-2 space-x-2 bg-card border-b">
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

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <MsgCard
        v-for="(item, index) in store.msgList"
        :key="item.id" :item="item" :index="index"
      />
    </section>

    <MsgModal />
    <BuilInMsgModal />
  </div>
</template>
