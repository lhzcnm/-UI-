<script setup lang="ts">
import TheGlobalBack from './TheGlobalBack.vue'

import { tv } from 'tailwind-variants'

import { SERVICE_STORE } from '@desktop/pages/store/utils/symbol'
import { debounce } from '@3un/utils'

const serviceStore = inject(SERVICE_STORE)!

const { t } = useI18n()

const name = ref<string>(serviceStore.serviceSearch.serverName ?? '')

const groups = computed(() => {
  return Array.from(serviceStore.groupMap, ([key, value]) => ({ id: key, name: value }))
})

const style = tv({
  base: [
    'p-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 select-none',
    'border  bg-white/20 dark:bg-zinc-800/40 backdrop-blur-sm',
    'hover:scale-[1.03] hover:border-primary/40 hover:text-primary hover:shadow-primary/20 hover:shadow-md'
  ]
})

function handleClick(id: number = -1) {
  serviceStore.serviceSearch.groupId = id
}

const handleInput = debounce(() => {
  serviceStore.serviceSearch.serverName = name.value
})
</script>

<template>
  <div class="w-full flex flex-col">
    <TheGlobalBack name="服务组切换" />

    <div class="p-2 h-full flex flex-col space-y-3 overflow-y-auto" style="scrollbar-width: none;">
      <XInput
        ui-root="rounded-xl bg-white/30 dark:bg-zinc-800/60 border-none focus:ring-2 focus:ring-primary/40"
        v-model="name"
        :placeholder="t('keyword.placeholder')"
        @input="handleInput"
      />
      <button
        :class="[
          style(),
          serviceStore.serviceSearch.groupId === -1
            ? 'bg-primary/10 text-primary shadow-md border-primary/40 dark:bg-primary/30 dark:text-primary/90 dark:shadow-lg dark:scale-[1.02]'
            : ''
        ]"
        @click="handleClick()">
        <span>{{ t('all') }}</span>
      </button>

      <button
        v-for="group in groups"
        :class="[
          style(),
          serviceStore.serviceSearch.groupId === group.id
            ? 'bg-primary/10 text-primary shadow-md border-primary/40 dark:bg-primary/30 dark:text-primary/90 dark:shadow-lg dark:scale-[1.02]'
            : ''
        ]"
        @click="handleClick(group.id)">
        <span>{{ group.name }}</span>
      </button>
    </div>
  </div>
</template>
