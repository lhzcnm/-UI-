<script setup lang="ts">
import type { MenuType } from '@/inters/System'

const route = useRoute()

const { setting } = useSettingStore()
const { locale } = useI18n()

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

function handleClick(item: MenuType) {
  // const isClient = item.name.includes('client')

  // if(isClient) {
  //   location.href = "/"
  // } else {
  //   router.push(item.path)
  // }
  location.href = item.path
}
</script>

<template>
  <header class="header-wrapper">
    <nav class="nav-bar">
      <div class="nav-left">
        <img class="logo" :src="logo" alt="" />
        <span class="app-name">{{ appName }}</span>
      </div>

      <div class="nav-right">
        <button
          v-for="menu in menus"
          :key="menu.name"
          class="nav-item"
          :class="{ active: route.name === menu.name }"
          @click="handleClick(menu)"
        >
          {{ menu.title }}
        </button>
      </div>
    </nav>

    <div class="header-content">
      <h1>设备查询解锁服务提供商</h1>

      <p>提供苹果、谷歌等设备的验机查询服务，帮助用户了解设备详细信息</p>
      <p>提供苹果、谷歌等设备的解锁服务，帮助用户解决设备锁定问题</p>

      <!-- <button class="cta">立即体验</button> -->
    </div>
  </header>
</template>
