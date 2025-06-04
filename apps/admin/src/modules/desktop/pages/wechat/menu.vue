<script setup lang="ts">
import type { WechatMenu, WechatTreeMenus } from '@/inters/wechat'
import { zWechatMenuForm } from '@/inters/wechat'
import { getWechatMenu, createWechatMenu, updateWechatMenu, deleteWechatMenu, pushWechatMenu } from '@/api/wechat'
import WechatMenuForm from './components/WechatMenuForm.vue'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'
import { Icon } from '@iconify/vue'

import type { MenuStore } from './utils'
import { MENU_STORE } from './utils'

const store: MenuStore = reactive({
  formBase: zWechatMenuForm.parse({}),
  visibleBase: false,
  index: undefined,
  menus: [] as WechatTreeMenus[],
})

provide(MENU_STORE, store)

const loading = ref(false)
const pushLoading = ref(false)

await getList()

async function getList() {
  loading.value = true
  try {
    const response = await getWechatMenu()
    store.menus = getTreeMenus(response)
  } finally {
    loading.value = false
  }
}

function getTreeMenus(menus: WechatMenu[]) {
  const map = new Map<number, WechatTreeMenus>()
  const treeMenus: WechatTreeMenus[] = []

  menus.forEach((menu) => {
    const parent = map.get(menu.parentId)
    const menuWithChildren = { ...menu, children: [] }

    if (parent) {
      parent.children.push(menuWithChildren)
    } else {
      treeMenus.push(menuWithChildren)
    }
    map.set(menu.id, menuWithChildren)
  })
  return treeMenus
}

function handleAddMenu(parentId = 0) {
  store.formBase = zWechatMenuForm.parse({ parentId })
  store.index = undefined
  store.visibleBase = true
}

function handleEditMenu(menu: WechatMenu, index: number) {
  store.formBase = zWechatMenuForm.parse(menu)
  store.index = index
  store.visibleBase = true
}

async function handleDeleteMenu(id: number) {
  const confirmed = await xconfirm({
    title: '确认删除',
    text: '删除菜单后将无法恢复，确定要删除吗？',
    confirmText: '删除',
    cancelText: '取消'
  })
  
  if (!confirmed) return
  
  try {
    await deleteWechatMenu(id)
    await getList()
    toast.success('菜单删除成功')
  } catch (error) {
    console.error('删除菜单失败:', error)
    toast.error('删除菜单失败，请稍后重试')
  }
}

async function handlePushMenu() {
  pushLoading.value = true
  try {
    await pushWechatMenu()
    toast.success('菜单推送成功')
  } catch (error) {
    console.error('推送菜单失败:', error)
    toast.error('推送菜单失败，请稍后重试')
  } finally {
    pushLoading.value = false
  }
}

function getMenuTypeText(type: string) {
  const typeMap: Record<string, string> = {
    'click': '点击事件',
    'view': '跳转链接',
    'scancode_push': '扫码推送',
    'scancode_waitmsg': '扫码等待',
    'pic_sysphoto': '系统拍照',
    'pic_photo_or_album': '拍照或相册',
    'pic_weixin': '微信相册',
    'location_select': '地理位置',
    'media_id': '多媒体',
    'view_limited': '图文消息'
  }
  return typeMap[type] || type
}

function getMenuTypeIcon(type: string) {
  const iconMap: Record<string, string> = {
    'click': 'lucide:mouse-pointer-click',
    'view': 'lucide:external-link',
    'scancode_push': 'lucide:qr-code',
    'scancode_waitmsg': 'lucide:scan',
    'pic_sysphoto': 'lucide:camera',
    'pic_photo_or_album': 'lucide:image',
    'pic_weixin': 'lucide:images',
    'location_select': 'lucide:map-pin',
    'media_id': 'lucide:file-text',
    'view_limited': 'lucide:newspaper'
  }
  return iconMap[type] || 'lucide:menu'
}

function handleShowToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  switch (type) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'warning':
      toast.warning(message)
      break
    case 'info':
      toast.info(message)
      break
  }
}

// 计算统计数据
const menuStats = computed(() => {
  const totalMenus = store.menus.length
  const totalSubMenus = store.menus.reduce((sum, menu) => sum + (menu.children?.length || 0), 0)
  const disabledMenus = store.menus.filter(menu => menu.menuDisable).length + 
    store.menus.reduce((sum, menu) => sum + (menu.children?.filter(child => child.menuDisable).length || 0), 0)
  
  return {
    totalMenus,
    totalSubMenus,
    totalAll: totalMenus + totalSubMenus,
    disabledMenus
  }
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题和操作栏 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">微信菜单管理</h1>
        <p class="text-sm text-gray-600 mt-1">管理微信公众号自定义菜单</p>
      </div>
      <div class="flex space-x-3">
        <XButton
          color="primary"
          icon="lucide:plus"
          @click="handleAddMenu()"
        >
          添加主菜单
        </XButton>
        <XButton
          color="success"
          icon="lucide:upload"
          :loading="pushLoading"
          @click="handlePushMenu"
        >
          推送到微信
        </XButton>
      </div>
    </div>

    <!-- 统计信息卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总菜单数</p>
            <p class="text-2xl font-bold text-gray-900">{{ menuStats.totalAll }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:menu" class="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">一级菜单</p>
            <p class="text-2xl font-bold text-gray-900">{{ menuStats.totalMenus }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:folder" class="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">二级菜单</p>
            <p class="text-2xl font-bold text-gray-900">{{ menuStats.totalSubMenus }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:folder-open" class="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">已禁用</p>
            <p class="text-2xl font-bold text-gray-900">{{ menuStats.disabledMenus }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon icon="lucide:ban" class="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单树形展示 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">菜单结构</h2>
        <p class="text-sm text-gray-500 mt-1">最多支持3个一级菜单，每个一级菜单最多5个二级菜单</p>
      </div>
      
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">加载中...</p>
      </div>

      <div v-else-if="store.menus.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无菜单</h3>
        <p class="text-gray-500 mb-4">还没有创建任何菜单，点击上方按钮开始创建</p>
        <XButton 
          color="primary" 
          icon="lucide:plus"
          @click="handleAddMenu()"
        >
          创建第一个菜单
        </XButton>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <!-- 一级菜单 -->
        <div
          v-for="(menu, index) in store.menus"
          :key="menu.id"
          class="group hover:bg-gray-50 transition-colors"
          :class="{ 'opacity-60': menu.menuDisable }"
        >
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                  <span class="text-blue-600 font-semibold text-sm">{{ index + 1 }}</span>
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 flex items-center space-x-2">
                  <Icon :icon="getMenuTypeIcon(menu.type)" class="w-4 h-4 text-gray-600" />
                  <span>{{ menu.name }}</span>
                  <span v-if="menu.menuDisable" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                    禁用
                  </span>
                </h3>
                <div class="flex items-center space-x-4 mt-1">
                  <span class="text-sm text-gray-500 flex items-center space-x-1">
                    <Icon icon="lucide:tag" class="w-3 h-3" />
                    <span>{{ getMenuTypeText(menu.type) }}</span>
                  </span>
                  <span v-if="menu.key" class="text-sm text-gray-500 flex items-center space-x-1">
                    <Icon icon="lucide:key" class="w-3 h-3" />
                    <span>{{ menu.key }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <XButton
                size="sm"
                variant="soft"
                color="primary"
                icon="lucide:plus"
                @click="handleAddMenu(menu.id)"
              >
                添加子菜单
              </XButton>
              <XButton
                size="sm"
                variant="ghost"
                icon="lucide:edit"
                @click="handleEditMenu(menu, index)"
              >
                编辑
              </XButton>
              <XButton
                size="sm"
                variant="ghost"
                color="danger"
                icon="lucide:trash-2"
                @click="handleDeleteMenu(menu.id)"
              >
                删除
              </XButton>
            </div>
          </div>

          <!-- 二级菜单 -->
          <div v-if="menu.children && menu.children.length > 0" class="bg-gray-50 border-t border-gray-200">
            <div
              v-for="(child, childIndex) in menu.children"
              :key="child.id"
              class="group/child hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-60': child.menuDisable }"
            >
              <div class="flex items-center justify-between p-4 pl-16">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center shadow-sm">
                      <span class="text-gray-600 font-medium text-xs">{{ childIndex + 1 }}</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 flex items-center space-x-2">
                      <Icon :icon="getMenuTypeIcon(child.type)" class="w-3 h-3 text-gray-600" />
                      <span>{{ child.name }}</span>
                      <span v-if="child.menuDisable" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        禁用
                      </span>
                    </h4>
                    <div class="flex items-center space-x-4 mt-1">
                      <span class="text-sm text-gray-500 flex items-center space-x-1">
                        <Icon icon="lucide:tag" class="w-3 h-3" />
                        <span>{{ getMenuTypeText(child.type) }}</span>
                      </span>
                      <span v-if="child.key" class="text-sm text-gray-500 flex items-center space-x-1">
                        <Icon icon="lucide:key" class="w-3 h-3" />
                        <span>{{ child.key }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 opacity-0 group-hover/child:opacity-100 transition-opacity">
                  <XButton
                    size="sm"
                    variant="ghost"
                    icon="lucide:edit"
                    @click="handleEditMenu(child, childIndex)"
                  >
                    编辑
                  </XButton>
                  <XButton
                    size="sm"
                    variant="ghost"
                    color="danger"
                    icon="lucide:trash-2"
                    @click="handleDeleteMenu(child.id)"
                  >
                    删除
                  </XButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单编辑对话框 -->
    <WechatMenuForm @refresh="getList" @show-toast="handleShowToast" />
  </div>
</template>
