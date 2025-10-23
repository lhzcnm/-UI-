<script setup lang="ts">
import { SERVICE_STORE } from '@desktop/pages/store/utils/symbol'
import { tv } from 'tailwind-variants'

const store = inject(SERVICE_STORE)!

const { t } = useI18n()

const groups = computed(() => {
  return Array.from(store.groupMap, ([key, value]) => ({ id: key, name: value }))
})

const style = tv({
  base: [
    'p-2 rounded-lg text-sm transition-all duration-200',
    'border border-transparent hover:border-primary/40 hover:bg-primary/10 dark:hover:border-primary/20'
  ]
})

function handleClick(id: number = -1) {
  store.serviceSearch.groupId = id
}
</script>

<template>
  <div class="p-2 h-full flex flex-col space-y-4 overflow-y-auto" style="scrollbar-width: none;">
    <button
      :class="[style(), { 'bg-primary/20 border-primary/50 shadow-inner': store.serviceSearch.groupId === -1 }]"
      @click="handleClick()">
      <span>{{ t("all") }}</span>
    </button>
    <button
      v-for="group in groups"
      :class="[style(), { 'bg-primary/20 border-primary/50 shadow-inner': store.serviceSearch.groupId === group.id }]"
      @click="handleClick(group.id)">
      <span>{{ group.name }}</span>
    </button>
  </div>
</template>
