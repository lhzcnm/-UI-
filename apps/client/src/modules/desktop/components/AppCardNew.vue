<script setup lang="ts">
interface PropType {
  isSidebar: boolean
}

const prop = defineProps<PropType>()

const { locale } = useI18n()

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
  <div class="border rounded-lg p-4 bg-zinc-100/20 dark:bg-zinc-800/50" :class="prop.isSidebar? 'p-4' : 'p-6 mr-6'">
    <!-- <h3 class="text-lg mb-4">
      三和助手 - 标签|设备信息|批量查询
    </h3> -->
    <h3 class="mb-4 whitespace-pre text-center" :class="prop.isSidebar? 'text-sm' : 'text-lg'">
      {{ prop.isSidebar? localStore.localeSlotVal('profile_SoftwareNew', {'{name}': name}).slice(0,6) : localStore.localeSlotVal('profile_SoftwareNew', {'{name}': name})}}
    </h3>
    <div class="whitespace-nowrap  justify-center" :class="prop.isSidebar? 'flex flex-col space-y-2' : 'flex space-x-2'">
      <XButton
        icon="fa-brands:windows" label="Windows"
        variant="outline"
        @click="download(46)"
      />
      <XButtonSplit
        variant="outline" icon="fa-brands:apple" :openClick="true"
        label="MacOS" :options="options"
      />
    </div>
  </div>
</template>
