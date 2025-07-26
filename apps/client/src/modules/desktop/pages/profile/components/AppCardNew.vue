<script setup lang="ts">
const mode = import.meta.env.VITE_APP_MODE
const options = [
  { label: 'ARM架构', command: () => download(47) },
  { label: 'Intel架构', command: () => download(48) },
]

function download(platform: number) {
  const baseUrl = import.meta.env.VITE_API_URL
  location.href = `${baseUrl}/oss/download/${platform}`
}
</script>

<template>
  <div class="border rounded-lg p-6 mr-6 bg-card">
    <h3 class="text-lg mb-4">
      桌面应用 
      <span class="text-danger font-bold" v-if="mode === 'SanHe'"> - 新</span>
    </h3>
    <div class="space-x-2 whitespace-nowrap">
      <XButton
        icon="fa-brands:windows" label="Windows 下载"
        variant="outline"
        @click="download(46)"
      />

      <!-- <XButton
        icon="fa-brands:apple" label="macOS Arm 下载"
        variant="outline" color="danger"
        @click="download(47)"
      />

      <XButton
        icon="fa-brands:apple" label="macOS Intel 下载"
        variant="outline" color="danger"
        @click="download(48)"
      /> -->
      <XButtonSplit
        variant="outline" icon="fa-brands:apple"
        class="bg-danger"
        label="MacOS下载" :options="options"
      />
    </div>
  </div>
</template>
