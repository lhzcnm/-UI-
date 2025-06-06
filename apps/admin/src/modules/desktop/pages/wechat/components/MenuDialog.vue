<script setup lang="ts">
import MenuForm from '@/components/forms/wechat/MenuForm.vue'
import { updateWechatMenu } from '@/api/wechat'
import { MENU_STORE } from '../utils'

const store = inject(MENU_STORE)!

async function handleUpdate() {
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
  <XDialog
    v-model="store.visibleMenu"
    title="菜单管理"
  >
    <MenuForm v-model="store.formMenu" />
    <template #footer>
      <div class="flex justify-end mt-4 space-x-2">
        <XButton label="取消" variant="soft" @click="store.visibleMenu = false" />
        <XButton label="确定" @click="handleUpdate" />
      </div>
    </template>
  </XDialog>
</template>
