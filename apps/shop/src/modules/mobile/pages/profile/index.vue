<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SlideRight from '@mobile/components/SlideRight.vue'
import LanuageSwitch from './components/LanuageSwitch.vue'
import OrderSearch from './components/OrderSearch.vue'

import type { ClassNameValue } from 'tailwind-merge'
import { type Action } from './utils/types'

interface ToolItem {
  name: string,
  icon: string,
  action?: string,
  command: () => void,
  iconClass?: ClassNameValue,
}

const { t } = useI18n()
const iStore = useSystemStore()

const activeTab = ref<Action | null>(null)
const visible = ref<boolean>(false)

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
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- <section class="bg-card rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <div class="w-14 h-14 bg-muted rounded-full"></div>
      <div>
        <h2 class="text-lg font-semibold">用户名</h2>
        <p class="text-sm text-muted-foreground">欢迎回来</p>
      </div>
    </section> -->
    <section>
      <h3 class="text-sm font-medium text-muted-foreground mb-2">网站工具</h3>

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
      <h3 class="text-sm font-medium text-muted-foreground mb-2">商城服务</h3>

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
