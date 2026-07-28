<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMenu } from '../composables/useMenu'
import { menusClientDesktop } from '@/utils/menu'

const {
  activeId,
  expanded,
  searchKeyword,
  filteredItems,
  isParentActive,
  toggleExpand,
  setActive
} = useMenu(menusClientDesktop)

defineExpose({ activeId, expanded })
</script>

<template>
  <aside class="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm">
    <div class="p-5 flex justify-center items-center space-x-2 select-none">
      <img src="/favicon.png" class="h-8" />
      <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">使用说明</h1>
    </div>

    <div class="px-3 pb-2 mt-3">
      <div class="relative">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文档..."
          class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <span class="absolute left-3 top-2 text-slate-400">🔍</span>
        <button
          v-if="searchKeyword"
          @click="searchKeyword = ''"
          class="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
        >✕</button>
      </div>
    </div>

    <nav class="flex-1 p-3 space-y-1 overflow-y-auto" style="-ms-overflow-style:none; scrollbar-width:none;">
      <div v-if="filteredItems.length === 0" class="text-sm text-slate-400 text-center py-8">
        没有找到匹配的文档
      </div>
      <template v-for="item in filteredItems" :key="item.id">
        <div v-if="item.children && item.children.length">
          <div
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 select-none"
            :class="[
              activeId === item.id || isParentActive(item.id)
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
            @click="toggleExpand(item.id)"
          >
            <span class="flex-1">{{ item.label }}</span>
            <span class="transition-transform duration-200" :class="{ 'rotate-90': expanded[item.id] }">
              <Icon class="w-4 h-4 flex-shrink-0" icon="lucide:chevron-right" />
            </span>
          </div>
          <div v-show="expanded[item.id]" class="ml-4 space-y-1 mt-1 border-l-2 border-slate-200 pl-2">
            <a
              v-for="child in item.children"
              :key="child.id"
              href="#"
              class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                activeId === child.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              ]"
              @click.prevent="setActive(child.id)"
            >{{ child.label }}</a>
          </div>
        </div>
        <a
          v-else
          href="#"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          :class="[
            activeId === item.id
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          ]"
          @click.prevent="setActive(item.id)"
        >{{ item.label }}</a>
      </template>
    </nav>
  </aside>
</template>