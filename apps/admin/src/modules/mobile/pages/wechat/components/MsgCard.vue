<script setup lang="ts">
import { xconfirm } from '@3un/utils'
import { twJoin } from 'tailwind-merge'

import { zCustomMsgForm, type CustomMsg } from '@/inters/wechat'
import { deleteCustomMsg } from '@/api/wechat'
import { MSG_STORE } from '../utils'

interface TheProps {
  item: CustomMsg
  index: number
}

const props = defineProps<TheProps>()
const store = inject(MSG_STORE)!

function handleClick() {
  store.formBase = zCustomMsgForm.parse(props.item)
  store.visibleBase = true
  store.index = props.index
}

async function handleDelete() {
  if (await xconfirm('确定删除该消息吗？')) {
    await deleteCustomMsg(props.item.id)
    store.msgList.splice(props.index, 1)
  }
}
</script>

<template>
  <div class="bg-card border rounded-lg" @click="handleClick">
    <div class="flex items-center justify-between p-3 pb-0">
      <h3 class="text-lg font-bold">客服消息 {{ item.id }}</h3>
    </div>

    <div class="px-3 py-2 text-sm">
      <div class="text-muted-foreground mb-1">关键字：</div>
      <div class="break-all mb-2">{{ item.keywords }}</div>

      <div class="text-muted-foreground mb-1">消息内容：</div>
      <div
        class="bg-muted rounded p-3 whitespace-pre-line overflow-x-auto"
        v-html="item.content.replace(/\n/g, '<br>')"
      />
    </div>

    <div
      :class="twJoin(
        'flex items-center justify-end',
        'px-3 py-2 border-t border-dashed',
      )"
    >
      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
