<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import DesktopHeader from './components/DesktopHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

import { useDocumentVisibility } from '@vueuse/core'
import { generateMenu } from '@/utils/menu'
import { ua } from '@3un/utils'

const route = useRoute()
const visibility = useDocumentVisibility()

const iStore = useSettingStore()
const uStore = useUserStore()
const systemStore = useSystemStore()

const isLogout = ref(false)

await Promise.all([
  iStore.getSettings(),
  uStore.getInfo(),
])

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
  if (cur === 'visible' && prev === 'hidden') {
    uStore.getInfo()
  }
})

function handleLogout() {
  isLogout.value = false
  uStore.logout()
}

onMounted(() => {
  if(ua.browser === 'Unknown') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      // generate Rclick menu
      generateMenu(e)
    })
  }
})
</script>

<template>
  <DesktopHeader />
  <div class="flex h-container">
    <Transition name="slide-left">
      <TheSidebar v-model="isLogout" v-if="systemStore.showSidebar" :menus />
    </Transition>

    <RouterView v-slot="{ Component }" :key="route.path">
      <main v-if="Component" class="flex-1 overflow-y-auto">
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
  <XDialog
    uiRoot="w-64 p-6 rounded-2xl shadow-xl"
    :closeBtn="false"
    :maskClosable="false"
    v-model="isLogout"
  >
    <template #header>
      <h2 class="text-lg font-semibold text-center text-gray-900 mb-2">{{ t('prompt.title') }}</h2>
    </template>

    <template #default>
      <p class="text-sm text-center text-gray-600 mb-6">{{ t('prompt.confirm', { action: t('barItem.logout') }) }}</p>
    </template>

    <template #footer>
      <div class="flex justify-around gap-4">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="isLogout = false" @confirm="handleLogout"
        />
      </div>
    </template>
  </XDialog>
</template>
