<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface RouteItem {
  name: string,
  icon: string,
  mode: string,
  view: string,
  path: string,
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const stores: RouteItem[] = [
  {
    name: t('mall.views.service'),
    icon: 'lucide:wifi',
    mode: 'service',
    view: 'Store',
    path: '/store',
  },
  {
    name: t('mall.views.device'),
    icon: 'lucide:pc-case',
    mode: 'device',
    view: 'DeviceStore',
    path: '/store/device',
  },
]

function handleClick(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="h-store-header grid items-center justify-items-center shadow-md backdrop-blur-md border-b border-white/10"
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
          :class="{ 'text-primary border-b border-b-primary': route.name === item.view }"
          @click="handleClick(item.path)">
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
    </section>
  </div>
</template>
