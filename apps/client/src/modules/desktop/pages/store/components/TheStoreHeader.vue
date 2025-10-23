<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { SERVICE_STORE } from '../utils/symbol'
import type { StoreStatus } from '../utils/types'

interface RouteItem {
  name: string,
  icon: string,
  mode: string,
  view: StoreStatus,
}

const { t } = useI18n()

const store = inject(SERVICE_STORE)!

const stores: RouteItem[] = [
  {
    name: t('mall.views.service'),
    icon: 'lucide:wifi',
    mode: 'service',
    view: 'serviceStore',
  },
  {
    name: t('mall.views.device'),
    icon: 'lucide:pc-case',
    mode: 'device',
    view: 'deviceStore',
  },
]

function handleClick(view: StoreStatus) {
  store.storeStatus = view
}
</script>

<template>
  <div class="h-store-header grid items-center justify-items-center shadow-md bg-background"
       style="grid-template-columns: auto 1fr auto;">
    <section class="size-full border-r border-dashed flex items-center px-4">
      <TheLogo size="36" />
    </section>
    <section>
      <template
        v-for="item in stores" :key="item.path"
      >
        <button
          class="bg-transparent border-r p-2 last:border-r-0"
          :class="{ 'text-primary border-b border-b-primary': store.storeStatus.includes(item.mode) }"
          @click="handleClick(item.view)">
          <div class="flex items-center space-x-1">
            <Icon class="size-6" :icon="item.icon" />
            <span class="text-lg">{{ item.name }}</span>
          </div>
        </button>
      </template>
    </section>
    <section class="size-full border-l border-dashed flex items-center space-x-2 px-4">
      <XInput
        uiRoot="w-32 rounded-full bg-transparent text-success border-2 border-border text-muted hover:w-64 focus-within:w-64 transition duration-300 ease-in-out"
        style="transition: width 0.3s ease;"
        icon="lucide:search"
        clearable :placeholder="t('store.order.search')"
      />
      <LanguageSwitch />
      <TheTheme />
      <!-- <StoreAvatar :url="store.userInfo?.avatar" /> -->
    </section>
  </div>
</template>
