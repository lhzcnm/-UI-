<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { locale } = useI18n()
const { setting } = useSettingStore()

const show = ref<boolean>(false)

const mode = import.meta.env.VITE_APP_MODE
const menus = [
  {
    title: '首页',
    path: '/shop/home',
    name: 'shopHome',
  },
  {
    title: "客户端查询",
    path: '/',
    name: 'clientHome',
  },
  {
    title: "服务商城",
    path: '/shop/services',
    name: 'shopServices',
  },
]

const logo = computed(() => {
  return `/${mode}/favicon.png`
})

const appName = computed(() => {
  return locale.value === 'zh' ? setting.title : setting.titleEn ? setting.titleEn : setting.title
})
</script>

<template>
  <header class="w-full px-4 py-3 flex items-center justify-between border-b bg-white">
    <div class="flex items-center space-x-3">
      <img :src="logo" class="h-10 w-10" alt="">
      <span class="font-semibold text-lg">{{ appName }}</span>
    </div>

    <button @click="show = !show">
      <Icon class="size-8" icon="lucide:menu" />
    </button>

    <Transition name="fade">
      <div
        v-if="show"
        class="absolute top-[4rem] right-0 bg-white shadow-lg rounded-xl w-40 py-3 space-y-2 flex flex-col border">
        <button v-for="menu in menus" :key="menu.path"
          class="text-sm py-2 active:bg-zinc-100 border-b last:border-b-0">
          {{ menu.title }}
        </button>
      </div>
    </Transition>

    <div class="header-wrapper absolute inset-0 z-[-1]"></div>
  </header>
</template>
