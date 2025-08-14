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

const hideDevice =
  import.meta.env.VITE_APP_DEVICE === 'false' ||
  // 用户未开启设备
  !uStore.info.enableDevice

const menus = [
  { label: '首页',    path: '/', icon: 'iconoir:home-alt-slim-horiz' },
  { label: '订单查询', path: '/submit', icon: 'iconoir:atom' },
  {
    label: '我的设备',
    path: '/device',
    icon: 'iconoir:laptop-charging',
    hide: hideDevice,
  },
  { label: '我的订单', path: '/history', icon: 'iconoir:page-flip' },
  { label: '积分充值', path: '/recharge', icon: 'iconoir:credit-card' },
  { label: '积分记录', path: '/credits', icon: 'iconoir:bitcoin-rotate-out' },
  {
    label: '我的工单',
    path: '/ticket',
    icon: 'iconoir:chat-lines',
    hide: !iStore.settings.enableTricket,
  },
  { label: '会员中心', path: '/profile', icon: 'iconoir:user' },
  { label: '退出登录', path: '/logout', icon: 'iconoir:log-out'}
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
      <h2 class="text-lg font-semibold text-center text-gray-900 mb-2">提示</h2>
    </template>

    <template #default>
      <p class="text-sm text-center text-gray-600 mb-6">是否确认退出登录</p>
    </template>

    <template #footer>
      <div class="flex justify-around gap-4">
        <XButton
          class="w-16 !h-8 text-sm rounded-md"
          color="primary"
          variant="outline"
          label="取消"
          @click="isLogout = false"
        />
        <XButton
          class="w-16 !h-8 text-sm rounded-md"
          color="primary"
          label="确认"
          @click="handleLogout"
        />
      </div>
    </template>
  </XDialog>
</template>
