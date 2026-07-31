<script setup lang="ts">
interface PropType {
  isSidebar: boolean
}

const prop = defineProps<PropType>()


const localStore = useLocalStore()

function download(platform: string) {
  const baseUrl = import.meta.env.VITE_API_URL
  const type = platform === 'windows' ? 1 : 2
  location.href = `${baseUrl}/oss/download/${type}`
}
</script>

<template>
  <div class="border rounded-lg bg-card" :class="prop.isSidebar? 'p-4' : 'p-6 mr-6'">
    <!-- <h3 class="text-lg mb-4">批量查询助手</h3> -->
    <h3 class="text-center mb-4" :class="prop.isSidebar? 'text-sm' : 'text-lg'">{{ localStore.localData['profile_SoftwareOld'] }}</h3>
    <div class="whitespace-nowrap" :class="prop.isSidebar? 'flex space-y-2 flex-col' : 'space-x-2'">
      <XButton
        icon="fa-brands:windows" label="Windows"
        variant="outline"
        @click="download('windows')"
      />

      <XButton
        icon="fa-brands:apple" label="macOS"
        variant="outline" color="danger"
        @click="download('macos')"
      />
    </div>
  </div>
</template>
