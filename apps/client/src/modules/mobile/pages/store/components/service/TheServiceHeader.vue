<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { tv } from 'tailwind-variants'

import type { StoreType, StoreTypeItem } from '@mobile/pages/store/utils/types'
import { SERVICE_STORE } from '@mobile/pages/store/utils/symbol'

const store = inject(SERVICE_STORE)!

const storeTypes: StoreTypeItem[] = [
  { id: 'all', name: '全部' },
  { id: 'hot', name: '热门服务' },
  { id: 'new', name: '新服务' },
]

const style = tv({
  slots: {
    root: [
      'w-full pt-2 flex flex-col space-y-4 items-center justify-between overflow-x-auto',
      'px-3 no-scrollbar',
    ],
    item: [
      'relative flex-shrink-0 text-sm font-medium px-4 py-2 transition-all',
      'text-gray-600 dark:text-gray-400',
      'active:scale-95',
      'cursor-pointer select-none',
    ],
    itemActive: [
      'text-primary font-semibold',
      'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:rounded-full after:bg-primary',
    ],
    input: [
      'flex-1 bg-white dark:bg-black p-2 rounded-lg',
      'focus:ring-2 focus:outline-none focus:ring-primary'
    ],
    icon: [
      'text-black dark:text-white size-8'
    ]
  }
})

const b = style()

function handleSelect(id: StoreType) {
  store.storeType = id
}
</script>

<template>
  <div :class="b.root()">
    <div class="w-full flex items-center space-x-4">
      <input :class="b.input()" placeholder="关键词" />
      <Icon :class="b.icon()" icon="lucide:layout-list" v-show="store.displayMode === 'flex'" @click="store.displayMode = 'grid'" />
      <Icon :class="b.icon()" icon="lucide:layout-grid" v-show="store.displayMode === 'grid'" @click="store.displayMode = 'flex'" />
    </div>
    <div class="w-full flex justify-around">
      <div
        v-for="t in storeTypes"
        :key="t.id"
        :class="[b.item(), store.storeType === t.id && b.itemActive()]"
        @click="handleSelect(t.id)"
      >
        {{ t.name }}
      </div>
    </div>
  </div>
</template>
