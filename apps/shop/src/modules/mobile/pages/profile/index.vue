<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SlideRight from '@mobile/components/SlideRight.vue'
import LanuageSwitch from './components/LanuageSwitch.vue'
import OrderSearch from './components/OrderSearch.vue'

import type { ClassNameValue } from 'tailwind-merge'
import { type Action } from './utils/types'
import { ua } from '@3un/utils'

interface ToolItem {
  name: string,
  icon: string,
  action?: string,
  command: () => void,
  iconClass?: ClassNameValue,
}

const { t, locale } = useI18n()
const iStore = useSystemStore()
const { userInfo } = useUserStore()

const activeTab = ref<Action | null>(null)
const visible = ref<boolean>(false)

const mode = import.meta.env.VITE_APP_MODE

const webTools = computed<ToolItem[]>(() => {
  return [
    {
      name: t('shop.tool.name.home'),
      icon: "streamline-ultimate-color:single-woman-home",
      command: () => location.href = "/shop",
    },
    {
      name: t('shop.tool.name.auth'),
      icon: "streamline-ultimate-color:login-key",
      command: () => location.href = "/auth",
    },
    {
      name: t('shop.tool.name.theme'),
      icon: iStore.theme === "dark" ? "openmoji:crescent-moon" : "openmoji:sun",
      command: () => iStore.toggleTheme(),
    },
    {
      name: t('shop.tool.name.lang'),
      icon: "lucide:languages",
      iconClass: "text-primary",
      action: "languages",
      command: () => handleClick("languages"),
    }
  ]
})

const avatar = computed(() => {
  return userInfo.avatar ? userInfo.avatar : `/${mode}/default_avatar.jpg`
})

const displayName = computed(() => {
  return userInfo.role === 3 ? userInfo.username : userInfo.nickname
})

const displayWelcome = computed(() => {
  const name = locale.value === "zh" ? import.meta.env.VITE_APP_NAME : import.meta.env.VITE_APP_NAME_EN

  return t("shop.profile.welcome", { name: name })
})

const shopTools = computed<ToolItem[]>(() => {
  return [
    {
      name: t('shop.tool.name.order'),
      icon: "streamline-ultimate-color:book-search",
      iconClass: "text-primary",
      action: "search",
      command: () => handleClick("search"),
    },
    {
      name: t('shop.tool.name.history'),
      icon: "streamline-ultimate-color:paginate-filter-text",
      command: () => location.href = "/shop/history",
    }
  ]
})

function handleClick(action: Action) {
  activeTab.value = action
  visible.value = true
}

const activeTitle = computed(() => {
  const options = {
    languages: t('shop.tool.name.lang'),
    search: t('shop.tool.name.order'),
    history: t('shop.tool.name.history'),
  }

  return options[activeTab.value as Action]
})

function onClose() {
  activeTab.value = null
  visible.value = false
}

function logout() {
  const authKey = import.meta.env.VITE_ACCESS_TOKEN
  const guestKey = import.meta.env.VITE_GUEST_TOKEN

  localStorage.removeItem(authKey)
  localStorage.removeItem(guestKey)

  location.reload()
}
</script>

<template>
  <div class="w-full h-full flex flex-col p-4 space-y-6">
    <section class="w-full bg-card rounded-xl p-4 flex items-center gap-4 shadow-sm justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-14 h-14 bg-muted rounded-full flex items-center">
          <img class="rounded-full" :src="avatar" alt="">
        </div>
        <div class="w-full flex flex-col flex-wrap">
          <h2 class="text-lg font-semibold whitespace-normal break-all">{{ displayName }}</h2>
          <p class="text-sm text-muted-foreground">{{ displayWelcome }}</p>
        </div>
      </div>
      
      <XButton
        v-if="!ua.isWechat && userInfo.role !== 3"
        color="danger" :label="t('button.logout')"
        @click="logout"
      />
    </section>
    <section>
      <h3 class="text-sm font-medium text-muted-foreground mb-2">{{ t("shop.tool.title.web") }}</h3>

      <div class="p-2 grid grid-cols-4 gap-3 border rounded">
        <button
          v-for="(tool, index) in webTools" :key="index"
          class="flex flex-col items-center p-3 rounded-xl shadow-sm"
          @click="tool.command">
          <Icon :icon="tool.icon" class="size-6" :class="tool.iconClass" />
          <span class="text-xs mt-1">{{ tool.name }}</span>
        </button>
      </div>
    </section>
    <section>
      <h3 class="text-sm font-medium text-muted-foreground mb-2">{{ t("shop.tool.title.shop") }}</h3>

      <div class="p-2 grid grid-cols-4 gap-3 border rounded">
        <button
          v-for="(tool, index) in shopTools" :key="index"
          class="flex flex-col items-center p-3 rounded-xl shadow-sm"
          @click="tool.command">
          <Icon :icon="tool.icon" class="size-6" :class="tool.iconClass" />
          <span class="text-xs mt-1">{{ tool.name }}</span>
        </button>
      </div>
    </section>

    <SlideRight
      v-model="visible"
      :title="activeTitle"
      @close="onClose"
    >
      <LanuageSwitch v-if="activeTab === 'languages'" />
      <OrderSearch v-if="activeTab === 'search'" />
    </SlideRight>
  </div>
</template>
