<script setup lang="ts">
const { setting } = useSettingStore()
const { locale } = useI18n()

const appName = computed(() =>
  locale.value === 'zh' ? setting.title : setting.titleEn || setting.title
)

const mode = import.meta.env.VITE_APP_MODE
const logo = `/${mode}/favicon.png`
</script>

<template>
  <footer class="bg-zinc-900 text-white w-full px-5 py-2 pt-4 space-y-4 text-sm">

    <div class="flex items-center space-x-3">
      <img :src="logo" class="w-8 h-8" />
      <span class="font-medium text-lg">{{ appName }}</span>
    </div>

    <p class="text-gray-400 text-xs leading-relaxed">
      提供 IMEI / SN 查询、设备解锁、批量查询与 API 服务
    </p>

    <div class="text-gray-400 text-xs space-y-1">
      <p>邮箱：{{ setting.email }}</p>
      <p>地址：{{ setting.address }}</p>
      <p>电话：{{ setting.phone }}</p>
    </div>

    <div class="pt-4 text-center text-gray-500 text-xs">
      © {{ new Date().getFullYear() }} {{ appName }} ·
      <a class="underline" href="https://beian.miit.gov.cn/" target="_blank">
        {{ setting.beian }}
      </a>
    </div>
  </footer>
</template>
