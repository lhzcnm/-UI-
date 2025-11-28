<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { tv } from 'tailwind-variants'

import { type DisplayMode, type ShopType, type ShopTypeItem } from '../utils/types'

const displayMode = defineModel<DisplayMode>()
const filterType = defineModel<ShopType>("type")
const input = defineModel<string>("input")

const { t } = useI18n()

const storeTypes: ShopTypeItem[] = [
  { id: 'all', name: t("shop.type.all") },
  { id: 'hot', name: t("shop.type.hot") },
  { id: 'new', name: t("shop.type.new") },
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
      'flex-1 bg-white dark:bg-black p-2 rounded-lg border border-primary/20',
      'focus:ring-2 focus:outline-none focus:ring-primary'
    ],
    icon: [
      'text-black dark:text-white size-8'
    ]
  }
})

const b = style()

function handleSelect(id: ShopType) {
  // store.storeType = id
  filterType.value = id
}
</script>

<template>
  <div :class="b.root()">
    <div class="w-full flex items-center space-x-4">
      <input :class="b.input()" :placeholder="t('keyword.placeholder')" v-model="input" />
      <Icon :class="b.icon()" icon="lucide:layout-list" v-show="displayMode === 'flex'" @click="displayMode = 'grid'" />
      <Icon :class="b.icon()" icon="lucide:layout-grid" v-show="displayMode === 'grid'" @click="displayMode = 'flex'" />
    </div>
    <div class="w-full flex justify-around">
      <button
        v-for="t in storeTypes"
        :key="t.id"
        :class="[b.item(), filterType === t.id && b.itemActive()]"
        @click="handleSelect(t.id)"
      >
        {{ t.name }}
      </button>
    </div>
  </div>
</template>
