<script setup lang="ts">
import MenuItemForm from '@/components/forms/wechat/MenuItemForm.vue'
import { createWechatMenu, updateWechatMenu } from '@/api/wechat'
import { MENU_STORE, MENU_TYPES } from '../utils'

const store = inject(MENU_STORE)!

async function handleCreate() {
  const menu = await createWechatMenu(store.formBase)
  store.menus[store.parentIdx!].children.push(menu)
  store.visibleBase = false
}

async function handleUpdate() {
  const parent = store.menus[store.parentIdx!]
  const item = parent.children[store.currentId!]
  const body = { ...store.formBase, id: item.id }

  await updateWechatMenu(body)
  parent.children[store.currentId!] = body
  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.currentId"
    :update="handleUpdate"
    :create="handleCreate"
  >
    <MenuItemForm
      v-model="store.formBase"
      :menu-types="MENU_TYPES"
    />
  </FormDialog>
</template>
