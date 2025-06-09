<script setup lang="ts">
import type { WechatMenu } from '@/inters/wechat'
import { zWechatMenuForm } from '@/inters/wechat'
import { deleteWechatMenu } from '@/api/wechat'
import { MENU_TYPE_MAP, MENU_STORE } from '../utils'
import { xconfirm } from '@3un/utils'

interface MenuItemProps {
  menu: WechatMenu
  index: number
}

const props = defineProps<MenuItemProps>()
const store = inject(MENU_STORE)!

function openUpdate(menu: WechatMenu) {
  const index = store.menus
    .findIndex(item => item.id === menu.parentId)

  store.formBase = zWechatMenuForm.parse(menu)
  store.visibleBase = true
  store.parentIdx = index
  store.currentId = props.index
}

async function handleDelete(menu: WechatMenu) {
  if (!await xconfirm('确定删除该菜单吗？')) return

  await deleteWechatMenu(menu.id)
  const index = store.menus
    .findIndex(item => item.id === menu.parentId)

  const parent = store.menus[index]
  parent.children.splice(props.index, 1)
}
</script>

<template>
  <div class="py-2">
    <div class="flex justify-between items-center mb-1">
      <div class="text-sm font-bold">{{ menu.name }}</div>
      <div class="space-x-2">
        <XButton size="sm" label="编辑" @click="openUpdate(menu)" />
        <XButton size="sm" label="删除" color="danger" variant="outline" @click="handleDelete(menu)" />
      </div>
    </div>
    <div class="flex items-center text-sm text-muted-foreground">
      <span class="flex-shrink-0">{{ MENU_TYPE_MAP.get(menu.type)?.label }}</span>
      ·<div class="truncate">{{ menu.key }}</div>
    </div>
  </div>
</template>
