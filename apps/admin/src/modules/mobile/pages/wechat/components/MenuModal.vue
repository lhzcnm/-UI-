<script setup lang="ts">
import MenuForm from './MenuForm.vue'

import { toast } from 'vue-sonner'

import { updateWechatMenu } from '@/api/wechat'
import { MENU_STORE } from '../utils'

const store = inject(MENU_STORE)!

async function handleUpdate() {
  if (!store.formMenu.name) {
    toast.error('菜单名称不能为空')
    return
  }

  const parent = store.menus[store.parentIdx!]
  const body = { ...store.formMenu, id: parent.id }

  await updateWechatMenu(body)
  store.menus[store.parentIdx!] = {
    ...parent,
    ...body,
  }

  store.visibleMenu = false
}
</script>

<template>
  <TheModal v-model="store.visibleMenu" title="菜单管理">
    <MenuForm v-model="store.formMenu" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton label="取消" variant="soft" @click="store.visibleMenu = false" />
      <XButton label="确定" @click="handleUpdate" />
    </div>
  </TheModal>
</template>
