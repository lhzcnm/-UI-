<script setup lang="ts">
const name = import.meta.env.VITE_APP_NAME

function download(platform: number) {
  const baseUrl = import.meta.env.VITE_API_URL
  location.href = `${baseUrl}/oss/download/${platform}`
}
</script>

<template>
  <div
    class="relative top-[50%] translate-y-[-50%] m-4 p-6 flex flex-col items-center bg-white rounded-2xl shadow-lg border border-border"
  >
    <section class="p-4 text-center mb-6">
      <h2 class="text-2xl font-bold text-black mb-2">{{ name }}</h2>
      <p class="text-lg text-muted-foreground">批量查询工具</p>
    </section>
    
    <section class="w-full flex flex-col gap-4 select-none">
      <XButton
        class="w-full py-3 font-medium rounded-lg" 
        label="Windows下载"
        @click="download(46)"
      />
      <XButton
        class="w-full py-3 font-medium rounded-lg" 
        label="MacOS ARM下载"
        @click="download(47)"
      />
      <XButton
        class="w-full py-3 font-medium rounded-lg" 
        label="MACOS Intel下载"
        @click="download(48)"
      />
    </section>

    <section class="my-6 text-center text-sm text-muted-foreground">
      <p>版本: v1.0.0</p>
      <p>更新日期: 2025-08-29</p>
    </section>
  </div>
</template>
