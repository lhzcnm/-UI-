<script setup lang="ts">
import { useMenu } from '../composables/useMenu'
import { menusAdminMobile } from '@/utils/menu'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', id: string): void
}>()

const {
  activeId,
  expanded,
  searchKeyword,
  filteredItems,
  toggleExpand,
  setActive
} = useMenu(menusAdminMobile)

function close() {
  emit('close')
}

function selectItem(id: string) {
  setActive(id)
  emit('select', id)
  close()
}

// 暴露 activeId 供父组件监听
defineExpose({ activeId })
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300" @click="close"></div>
    <aside class="fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-out" :class="open ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-700">
          <span class="font-semibold text-gray-900 dark:text-white">目录</span>
          <button @click="close" class="p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索功能..."
            class="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
          />
        </div>
        <nav class="flex-1 overflow-y-auto py-2 px-3">
          <ul class="space-y-1">
            <template v-for="item in filteredItems" :key="item.id">
              <li>
                <template v-if="item.children && item.children.length">
                  <div
                    @click="toggleExpand(item.id)"
                    class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <span>{{ item.label }}</span>
                    <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-90': expanded[item.id] }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <ul v-if="expanded[item.id]" class="ml-4 space-y-1">
                    <li v-for="child in item.children" :key="child.id">
                      <button
                        @click="selectItem(child.id)"
                        class="w-full text-left px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        :class="{ 'font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': activeId === child.id }"
                      >
                        {{ child.label }}
                      </button>
                    </li>
                  </ul>
                </template>
                <button
                  v-else
                  @click="selectItem(item.id)"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  :class="{ 'font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': activeId === item.id }"
                >
                  {{ item.label }}
                </button>
              </li>
            </template>
          </ul>
        </nav>
        <div class="border-t border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-400 dark:text-gray-500 text-center">v2.0.1</div>
      </div>
    </aside>
  </Teleport>
</template>