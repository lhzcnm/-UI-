<script setup lang="ts">
function download(platform: string) {
  const baseUrl = import.meta.env.VITE_API_URL
  const type = platform === 'windows' ? 1 : 2
  location.href = `${baseUrl}/oss/download/${type}`
}
</script>

<template>
  <div class="border rounded-lg p-6 mr-6 bg-card">
    <h3 class="text-lg mb-4">批量查询助手</h3>
    <div class="space-x-2 whitespace-nowrap">
      <XButton
        icon="fa-brands:windows" label="Windows 下载"
        variant="outline"
        @click="download('windows')"
      />

      <XButton
        icon="fa-brands:apple" label="macOS 下载"
        variant="outline" color="danger"
        @click="download('macos')"
      />
    </div>
  </div>
</template>
