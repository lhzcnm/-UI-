<script setup lang="ts">
import DesktopHeader from './components/DesktopHeader.vue'
import TheSidebar from './components/TheSidebar.vue'

import { useDocumentVisibility } from '@vueuse/core'

const route = useRoute()
const visibility = useDocumentVisibility()

const iStore = useSettingStore()
const uStore = useUserStore()

await Promise.all([
  iStore.getSettings(),
  uStore.getInfo(),
])

const { popupAnnc, enablePopupAnnc, enableTricket } = iStore.settings
const visible = ref(enablePopupAnnc)

const menus = [
  { label: '首页',    path: '/', icon: 'iconoir:home-alt-slim-horiz' },
  { label: '订单查询', path: '/submit', icon: 'iconoir:atom' },
  { label: '我的设备', path: '/device', icon: 'lucide:smartphone' },
  { label: '我的订单', path: '/history', icon: 'iconoir:page-flip' },
  { label: '积分充值', path: '/recharge', icon: 'iconoir:credit-card' },
  { label: '积分记录', path: '/credits', icon: 'iconoir:bitcoin-rotate-out' },
  {
    label: '我的工单',
    path: '/ticket',
    icon: 'iconoir:chat-lines',
    hide: !enableTricket,
  },
  { label: '会员中心', path: '/profile', icon: 'iconoir:user' },
]

watch(visibility, (cur, prev) => {
  if (cur === 'visible' && prev === 'hidden') {
    uStore.getInfo()
  }
})
</script>

<template>
  <DesktopHeader />
  <div class="flex h-container">
    <TheSidebar :menus />

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
    v-model="visible" title="公告"
    :text="popupAnnc" :close-btn="false"
  >
    <template #footer>
      <div class="flex justify-end">
        <XButton @click="visible = false">
          朕知道了
        </XButton>
      </div>
    </template>
  </XDialog>
</template>
