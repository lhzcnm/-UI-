<script setup lang="ts">
import DesktopHeader from './components/DesktopHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

import { useSystemStore } from '@/stores/system'

import { useDocumentVisibility } from '@vueuse/core'

const route = useRoute()
const visibility = useDocumentVisibility()

const iStore = useSettingStore()
const uStore = useUserStore()
const systemStore = useSystemStore()
const serviceStore = useServiceStore()

const isLogout = ref(false)

await iStore.getSettings()

if(!route.meta.noAuthRequired) {
  await Promise.all([
    uStore.getInfo(),
    serviceStore.getServices(),
  ])
}

const { t } = useI18n()

const hideDevice =
  import.meta.env.VITE_APP_DEVICE === 'false' ||
  // 用户未开启设备
  !uStore.info.enableDevice

const menus = [
  { label: t('barItem.home'),    path: '/', icon: 'iconoir:home-alt-slim-horiz' },
  // { label: t('barItem.quote'), path: '/quote', icon: 'circum:receipt' },
  { label: t('barItem.query'), path: '/submit', icon: 'iconoir:atom' },
  { label: '查询打印', path: '/custom-submit', icon: 'iconoir:atom' },
  {
    label: t('barItem.device'),
    path: '/device',
    icon: 'iconoir:laptop-charging',
    hide: hideDevice,
  },
  { label: t('barItem.history.order'), path: '/history', icon: 'iconoir:page-flip' },
  { label: t('barItem.recharge'), path: '/recharge', icon: 'iconoir:credit-card' },
  { label: t('barItem.history.point'), path: '/credits', icon: 'iconoir:bitcoin-rotate-out' },
  {
    label: t('barItem.workOrder'),
    path: '/ticket',
    icon: 'iconoir:chat-lines',
    hide: !iStore.settings.enableTricket,
  },
  { label: t('barItem.profile'), path: '/profile', icon: 'iconoir:user' },
  { label: t('barItem.logout'), path: '/logout', icon: 'iconoir:log-out'}
]

watch(visibility, (cur, prev) => {
  if ((cur === 'visible' && prev === 'hidden') && !route.meta.noAuthRequired) {
    uStore.getInfo()
  }
})
</script>

<template>
  <DesktopHeader v-if="!route.meta.hideHeader" />
  <div class="flex h-container">
    <Transition name="slide-left">
      <TheSidebar v-model="isLogout" v-if="!route.meta.hideSidebar" v-show="systemStore.showSidebar" :menus />
    </Transition>
    <RouterView v-slot="{ Component }" :key="route.path">
      <main v-if="Component" class="flex-1 overflow-x-auto">
        <Transition name="fade-in" mode="out-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <Fallback />
            </template>
          </Suspense>
        </Transition>
      </main>
    </RouterView>
  </div>
  <LogoutDialog />
</template>
