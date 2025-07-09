<script setup lang="ts">
import MenuItemDialog from './components/MenuItemModal.vue'
import MenuDialog from './components/MenuModal.vue'
import MenuItem from './components/MenuItem.vue'

import type { WechatMenu, WechatTreeMenus } from '@/inters/wechat'
import { getWechatMenu, pushWechatMenu } from '@/api/wechat'
import { zWechatMenuForm, zWechatMenuItemForm } from '@/inters/wechat'

import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import type { MenuStore } from './utils'
import { MENU_STORE } from './utils'

const store: MenuStore = reactive({
  menus: [] as WechatTreeMenus[],

  formBase: zWechatMenuItemForm.parse({}),
  formMenu: zWechatMenuForm.parse({}),

  visibleBase: false,
  visibleMenu: false,

  currentId: undefined,
  parentIdx: undefined,
})

provide(MENU_STORE, store)

await getList()
async function getList() {
  const response = await getWechatMenu()
  store.menus = getTreeMenus(response)
}

function getTreeMenus(menus: WechatMenu[]) {
  const map = new Map<number, WechatTreeMenus>()
  const treeMenus: WechatTreeMenus[] = []

  menus.forEach((menu) => {
    const parent = map.get(menu.parentId)

    if (parent) parent.children.push(menu)
    else treeMenus.push({ ...menu, children: [] })
    map.set(menu.id, treeMenus[treeMenus.length - 1])
  })
  return treeMenus
}

function openCreate(index: number) {
  store.formBase = zWechatMenuItemForm.parse({})
  store.visibleBase = true
  store.parentIdx = index
  store.currentId = undefined
}

const isPushing = ref(false)
async function handlePush() {
  isPushing.value = true

  await pushWechatMenu()
  toast.success('推送成功')
  isPushing.value = false
}

function openUpdateMenu(menu: WechatTreeMenus, index: number) {
  store.formMenu = zWechatMenuForm.parse(menu)
  store.parentIdx = index
  store.visibleMenu = true
}
</script>

<template>
  <div class="h-full flex flex-col">
    <section class="px-3 py-2 bg-card border-b">
      <XButton
        icon="lucide:cloud-upload"
        color="success" label="推送"
        :loading="isPushing"
        @click="handlePush"
      />
    </section>

    <section class="flex flex-col space-y-3 p-3">
      <div
        v-for="(menu, index) in store.menus" :key="menu.id"
        class="bg-card border rounded-md"
      >
        <div class="flex justify-between items-center p-3 border-b">
          <div class="flex items-center space-x-1">
            <span class="font-bold">{{ menu.name }}</span>
            <button
              class="size-6 p-1 rounded hover:bg-muted text-muted-foreground"
              @click="openUpdateMenu(menu, index)"
            >
              <Icon icon="lucide:edit" class="size-full" />
            </button>
          </div>

          <XButton
            icon="lucide:plus"
            size="sm" label="新增"
            @click="openCreate(index)"
          />
        </div>

        <div class="px-3 divide-y divide-dashed">
          <MenuItem
            v-for="(child, childIndex) in menu.children" :key="child.id"
            :menu="child" :index="childIndex"
          />
        </div>
      </div>
    </section>

    <MenuItemDialog />
    <MenuDialog />
  </div>
</template>
