<script setup lang="ts">
import DesktopHeader from './components/DesktopHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

import { useSystemStore } from '@/stores/system'

import { useDocumentVisibility } from '@vueuse/core'
import type { SidebarMenu } from './types'
import { ACCESS_LEVEL } from '@3un/utils'
import { closeChannel, startChannel } from '@/utils/heartBeat'
import { setDataSets, setVersion } from '@/utils/device'

const route = useRoute()
const visibility = useDocumentVisibility()

const iStore = useSettingStore()
const uStore = useUserStore()
const systemStore = useSystemStore()
const serviceStore = useServiceStore()

const isLogout = ref(false)

await Promise.all([
  iStore.getSettings(),
  iStore.getHandleFee(),
  setDataSets(),
  setVersion(),
])

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

const menus: SidebarMenu[] = [
  { label: t('barItem.home'),    path: '/', icon: 'iconoir:home-alt-slim-horiz', type: 'basic' as const },
  // { label: t('barItem.quote'), path: '/quote', icon: 'circum:receipt' },
  { label: t('barItem.query'), path: '/submit', icon: 'iconoir:atom', type: 'basic' as const },
  { label: t('barItem.custom'), path: '/custom-submit', icon: 'iconoir:atom', type: 'basic' as const },
  {
    label: t('barItem.device'),
    path: '/device',
    icon: 'iconoir:laptop-charging',
    hide: hideDevice,
    type: 'basic' as const
  },
  { label: t('barItem.history.order'), path: '/history', icon: 'iconoir:page-flip', type: 'basic' as const },
  { label: t('barItem.recharge'), path: '/recharge', icon: 'iconoir:credit-card', type: 'basic' as const },
  { label: t('barItem.history.point'), path: '/credits', icon: 'iconoir:bitcoin-rotate-out', type: 'basic' as const },
  {
    label: t('barItem.workOrder'),
    path: '/ticket',
    icon: 'iconoir:chat-lines',
    hide: !iStore.settings.enableTricket,
    type: 'basic' as const
  },
  { label: t('barItem.profile'), path: '/profile', icon: 'iconoir:user', type: 'basic' as const },
  uStore.info.accessLevel === ACCESS_LEVEL.AUCTION && { label: t('barItem.auction'), path: '/auction', icon: 'lucide:laptop-minimal', type: 'extra' as const },
  { label: t('barItem.logout'), path: '/logout', icon: 'iconoir:log-out', type: 'basic' as const },
].filter((item) => !!item)

watch(visibility, (cur, prev) => {
  if ((cur === 'visible' && prev === 'hidden') && !route.meta.noAuthRequired) {
    uStore.getInfo()
  }
})

onMounted(() => {
  if (!uStore.isAdminLogin && uStore.info.heartbeatEnabled) {
    startChannel()
  }
})

onBeforeUnmount(async () =>{
  closeChannel()
  uStore.isAdminLogin = false
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
  <IdleModal />
</template>
