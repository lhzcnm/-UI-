<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface HeaderProps {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

defineProps<HeaderProps>()

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

      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        @click="toggleFullscreen"
      >
        <Icon
          :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'"
          class="size-5"
        />
      </button>
      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        accesskey="b"
      >
        <Icon icon="lucide:bell" class="size-5" />
      </button>
      <hr class="h-6 w-px bg-border" />
      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        accesskey="s"
      >
        <Icon icon="lucide:settings" class="size-5" />
      </button>
    </div>
  </div>
</template>
