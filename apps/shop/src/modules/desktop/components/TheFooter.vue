<script setup lang="ts">
const { setting } = useSettingStore()
const { locale } = useI18n()

const mode = import.meta.env.VITE_APP_MODE

const logo = computed(() => {
  return `/${mode}/favicon.png`
})

const appName = computed(() => {
  return locale.value === 'zh' ? setting.title : setting.titleEn ? setting.titleEn : setting.title
})
</script>

<template>
  <footer class="w-full bg-zinc-900 text-white py-10">

    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">

      <div>
        <div class="flex items-center space-x-3">
          <img class="size-10" :src="logo" alt="">
          <span class="text-xl font-semibold">{{ appName }}</span>
        </div>
        <p class="mt-4 text-gray-400 text-sm leading-relaxed">
          为用户提供 IMEI / SN 验机、设备查询与解锁服务  
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-lg mb-3">服务商城</h3>
        <ul class="space-y-2 text-gray-300">
          <li class="cursor-pointer hover:text-success">服务下单</li>
          <li class="cursor-pointer hover:text-success">历史查询</li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold text-lg mb-3">客户端查询</h3>
        <ul class="space-y-2 text-gray-300">
          <li class="cursor-pointer hover:text-success">{{ appName }}</li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold text-lg mb-3">联系我们</h3>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li>邮箱：{{ setting.email }}</li>
          <li>地址：{{ setting.address }}</li>
          <li>手机号：{{ setting.phone }}</li>
        </ul>
      </div>

    </div>

    <div class="mt-10 flex justify-center text-xs text-gray-500">
      © {{ new Date().getFullYear() }} {{ appName }}
      <span class="mx-2">·</span>
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        class="underline hover:text-gray-300"
      >
        {{ setting.beian }}
      </a>
    </div>
  </footer>
</template>

