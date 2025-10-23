<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import DesktopHeader from './components/DesktopHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

import { useDocumentVisibility } from '@vueuse/core'

const route = useRoute()
const visibility = useDocumentVisibility()

const iStore = useSettingStore()
const uStore = useUserStore()
const systemStore = useSystemStore()

const isLogout = ref(false)

await iStore.getSettings()

if(!route.meta.noAuthRequired) {
  await Promise.all([
    uStore.getInfo(),
  ])
}

const { t } = useI18n()

const hideDevice =
  import.meta.env.VITE_APP_DEVICE === 'false' ||
  // 用户未开启设备
  !uStore.info.enableDevice

const menus = [
  { label: t('barItem.home'),    path: '/', icon: 'iconoir:home-alt-slim-horiz' },
  { label: t('barItem.query'), path: '/submit', icon: 'iconoir:atom' },
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

const isStore = computed(() => route.path.includes('mall'))
</script>

<template>
  <div v-if="isStore">
    <RouterView v-slot="{ Component }"  :key="route.path">
      <Suspense>
        <Transition name="fade-in">
          <component :is="Component" />
        </Transition>
        <template #fallback>
          <Fallback />
        </template>
      </Suspense>
    </RouterView>
  </div>

  <div v-else>
    <DesktopHeader v-if="!route.meta.hideHeader" />
    <div class="flex h-container">
      <Transition name="slide-left">
        <TheSidebar v-model="isLogout" v-if="!route.meta.hideSidebar" v-show="systemStore.showSidebar" :menus />
      </Transition>
  
      <RouterView v-slot="{ Component }" :key="route.path">
        <main v-if="Component" class="flex-1">
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
  </div>

  <LogoutDialog />
</template>
