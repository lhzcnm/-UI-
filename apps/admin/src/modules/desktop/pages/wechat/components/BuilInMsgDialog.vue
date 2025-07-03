<script setup lang="ts">
import BuiltInForm from './BuiltInForm.vue'
import { updateBuiltInMsg, getBuiltInMsgList } from '@/api/wechat'
import { MSG_STORE } from '../utils'

const store = inject(MSG_STORE)!

async function handleUpdate() {
  await updateBuiltInMsg(store.formBuiltIn)
  store.builtInList = await getBuiltInMsgList()
  store.visibleBuiltIn = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleBuiltIn"
    title="编辑内置客服消息"
  >
    <BuiltInForm
      v-model="store.formBuiltIn"
      :built-in-list="store.builtInList"
    />

    <template #footer>
      <div class="flex justify-end mt-4 space-x-2">
        <XButton label="取消" variant="soft" @click="store.visibleBuiltIn = false" />
        <XButton label="确定" @click="handleUpdate" />
      </div>
    </template>
  </XDialog>
</template>
