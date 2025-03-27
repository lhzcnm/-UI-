<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const router = useRouter()
const systemStore = useSystemStore()

function handleClickHome() {
  systemStore.breadcrumbItems = []
  router.push('/')
}
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'w-full px-3 h-header border-b',
      'bg-opacity-50 backdrop-blur-sm',
    )"
  >
    <div class="flex items-center space-x-2">
      <Breadcrumb
        :items="systemStore.breadcrumbItems"
        @click-home="handleClickHome"
      />
    </div>
    <div class="flex items-center space-x-1">
      <TheTheme ghost />
      <button class="p-2 rounded-full hover:bg-muted text-muted-foreground">
        <Icon icon="lucide:settings" class="size-5" />
      </button>
    </div>
  </div>
</template>
