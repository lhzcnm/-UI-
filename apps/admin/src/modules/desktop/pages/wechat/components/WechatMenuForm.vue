<script setup lang="ts">
import type { WechatMenuCreateParams, WechatMenuUpdateParams } from '@/inters/wechat'
import { zWechatMenuForm } from '@/inters/wechat'
import { createWechatMenu, updateWechatMenu } from '@/api/wechat'
import type { MenuStore } from '../utils'
import { MENU_STORE } from '../utils'
import { Icon } from '@iconify/vue'

const store = inject<MenuStore>(MENU_STORE)!
const loading = ref(false)

const menuTypes = [
  { value: 'click', label: '点击事件', description: '用户点击后推送事件给开发者', icon: 'lucide:mouse-pointer-click' },
  { value: 'view', label: '跳转链接', description: '用户点击后直接跳转到指定网页', icon: 'lucide:external-link' },
  { value: 'scancode_push', label: '扫码推送', description: '弹出扫一扫，用户扫码后推送事件', icon: 'lucide:qr-code' },
  { value: 'scancode_waitmsg', label: '扫码等待', description: '弹出扫一扫，用户扫码后等待消息', icon: 'lucide:scan' },
  { value: 'pic_sysphoto', label: '系统拍照', description: '弹出系统拍照发图', icon: 'lucide:camera' },
  { value: 'pic_photo_or_album', label: '拍照或相册', description: '弹出拍照或者相册发图', icon: 'lucide:image' },
  { value: 'pic_weixin', label: '微信相册', description: '弹出微信相册发图器', icon: 'lucide:images' },
  { value: 'location_select', label: '地理位置', description: '弹出地理位置选择器', icon: 'lucide:map-pin' },
]

const emit = defineEmits<{
  refresh: []
  'show-toast': [type: 'success' | 'error' | 'warning' | 'info', message: string]
}>()

function isViewType() {
  return store.formBase.type === 'view'
}

function isClickType() {
  return store.formBase.type === 'click'
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

function validateForm() {
  if (!store.formBase.name.trim()) {
    emit('show-toast', 'warning', '请输入菜单名称')
    return false
  }
  
  if (store.formBase.name.length > 5) {
    emit('show-toast', 'warning', '菜单名称不能超过5个字符')
    return false
  }
  
  if (!store.formBase.type) {
    emit('show-toast', 'warning', '请选择菜单类型')
    return false
  }
  
  if (isClickType() && !store.formBase.key.trim()) {
    emit('show-toast', 'warning', '点击事件类型需要输入按键值')
    return false
  }
  
  if (isViewType()) {
    if (!store.formBase.key.trim()) {
      emit('show-toast', 'warning', '跳转链接类型需要输入链接地址')
      return false
    }
    
    try {
      new URL(store.formBase.key)
    } catch {
      emit('show-toast', 'warning', '请输入有效的URL地址')
      return false
    }
  }
  
  return true
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  try {
    const formData = zWechatMenuForm.parse(store.formBase)
    
    if (store.index !== undefined) {
      // 更新 - 需要从原始菜单数据中获取id
      const updateData: WechatMenuUpdateParams = {
        ...formData,
        id: (store.formBase as any).id || 0
      }
      await updateWechatMenu(updateData)
      emit('show-toast', 'success', '菜单更新成功')
    } else {
      // 创建
      await createWechatMenu(formData)
      emit('show-toast', 'success', '菜单创建成功')
    }
    
    store.visibleBase = false
    // 重新加载菜单列表
    await refreshMenuList()
  } catch (error) {
    console.error('操作失败:', error)
    emit('show-toast', 'error', `操作失败，请稍后重试`)
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  store.visibleBase = false
  store.formBase = zWechatMenuForm.parse({})
  store.index = undefined
}

// 假设有一个刷新菜单列表的方法
async function refreshMenuList() {
  // 通过emit通知父组件刷新
  emit('refresh')
}
</script>

<template>
  <XDialog v-model="store.visibleBase" :title="store.index !== undefined ? '编辑菜单' : '添加菜单'" max-width="600px">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 菜单名称 -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          菜单名称 <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <XInput
            id="name"
            v-model="store.formBase.name"
            placeholder="请输入菜单名称（1-5个字符）"
            maxlength="5"
            required
            :class="{ 'border-red-300': store.formBase.name.length > 5 }"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {{ store.formBase.name.length }}/5
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1 flex items-center space-x-1">
          <Icon icon="lucide:info" class="w-3 h-3" />
          <span>菜单名称不超过5个汉字或10个字母</span>
        </p>
      </div>

      <!-- 菜单类型 -->
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
          菜单类型 <span class="text-red-500">*</span>
        </label>
        <XSelect v-model="store.formBase.type" placeholder="请选择菜单类型">
          <XSelectItem
            v-for="type in menuTypes"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          >
            <div class="flex items-center space-x-3">
              <Icon :icon="type.icon" class="w-4 h-4 text-gray-600" />
              <div>
                <div class="font-medium">{{ type.label }}</div>
                <div class="text-xs text-gray-500">{{ type.description }}</div>
              </div>
            </div>
          </XSelectItem>
        </XSelect>
      </div>

      <!-- 按键值 (仅在click类型时显示) -->
      <div v-if="isClickType()">
        <label for="key" class="block text-sm font-medium text-gray-700 mb-2">
          按键值 <span class="text-red-500">*</span>
        </label>
        <XInput
          id="key"
          v-model="store.formBase.key"
          placeholder="请输入按键值"
          required
        />
        <p class="text-xs text-gray-500 mt-1">用户点击按钮后，微信会推送该按键值给开发者</p>
      </div>

      <!-- 跳转链接 (仅在view类型时显示) -->
      <div v-if="isViewType()">
        <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
          跳转链接 <span class="text-red-500">*</span>
        </label>
        <XInput
          id="url"
          v-model="store.formBase.key"
          placeholder="请输入完整的URL地址"
          required
        />
        <p class="text-xs text-gray-500 mt-1">必须是完整的URL地址，如：https://www.example.com</p>
      </div>

      <!-- 排序 -->
      <div>
        <label for="orderBy" class="block text-sm font-medium text-gray-700 mb-2">
          排序
        </label>
        <XInputNumber
          id="orderBy"
          v-model="store.formBase.orderBy"
          :min="0"
          :max="999"
          placeholder="0"
        />
        <p class="text-xs text-gray-500 mt-1">数字越小排序越靠前</p>
      </div>

      <!-- 是否禁用 -->
      <div class="flex items-center">
        <XSwitch
          id="menuDisable"
          v-model="store.formBase.menuDisable"
        />
        <label for="menuDisable" class="ml-2 text-sm font-medium text-gray-700">
          禁用此菜单
        </label>
      </div>

      <!-- 菜单预览 -->
      <div v-if="store.formBase.name" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
          <Icon icon="lucide:eye" class="w-4 h-4" />
          <span>菜单预览</span>
        </h4>
        <div class="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Icon :icon="getMenuTypeIcon(store.formBase.type)" class="w-4 h-4 text-gray-600" />
              <span class="font-medium text-gray-900">{{ store.formBase.name }}</span>
              <span v-if="store.formBase.menuDisable" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                禁用
              </span>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            <div>类型: {{ getMenuTypeText(store.formBase.type) }}</div>
            <div v-if="store.formBase.key">Key: {{ store.formBase.key }}</div>
            <div v-if="store.formBase.orderBy">排序: {{ store.formBase.orderBy }}</div>
          </div>
        </div>
      </div>

      <!-- 表单操作按钮 -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <XButton 
          type="button" 
          variant="ghost" 
          icon="lucide:x"
          @click="handleCancel"
        >
          取消
        </XButton>
        <XButton 
          type="submit" 
          color="primary" 
          :icon="store.index !== undefined ? 'lucide:save' : 'lucide:plus'"
          :loading="loading"
        >
          {{ store.index !== undefined ? '更新' : '创建' }}
        </XButton>
      </div>
    </form>
  </XDialog>
</template> 