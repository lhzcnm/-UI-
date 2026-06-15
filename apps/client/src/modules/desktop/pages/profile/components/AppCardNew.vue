<script setup lang="ts">
const {  locale } = useI18n()

const settingStore = useSettingStore()
const localStore = useLocalStore()

const options = [
  { label: 'ARM', command: () => download(47) },
  { label: 'Intel', command: () => download(48) },
]

const name = computed(() => {
  return locale.value === 'zh'
    ? settingStore.settings.title : settingStore.settings.titleEn
      ? settingStore.settings.titleEn : settingStore.settings.title

})

function download(platform: number) {
  const baseUrl = import.meta.env.VITE_API_URL
  location.href = `${baseUrl}/oss/download/${platform}`
}
</script>

<template>
  <div class="border rounded-lg p-6 mr-6 bg-card">
    <!-- <h3 class="text-lg mb-4">
      三和助手 - 标签|设备信息|批量查询
    </h3> -->
    <h3 class="text-lg mb-4 whitespace-pre text-center">
      {{ localStore.localeSlotVal('profile_SoftwareNew', {'{name}': name}) }}
    </h3>
    <div class="space-x-2 whitespace-nowrap flex justify-center">
      <XButton
        icon="fa-brands:windows" label="Windows"
        variant="outline"
        @click="download(46)"
      />
      <XButtonSplit
        variant="outline" icon="fa-brands:apple" :openClick="true"
        class="bg-danger"
        label="MacOS" :options="options"
      />
    </div>
  </div>
</template>
