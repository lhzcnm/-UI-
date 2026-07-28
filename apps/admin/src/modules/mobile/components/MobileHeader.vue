<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'

const iStore = useSystemStore()
const foldIcon = computed(() => {
  if (iStore.showSidebar) return 'lucide:panel-left-close'
  else return 'lucide:panel-left-open'
})

const style = tv({
  slots: {
    root: 'flex items-center justify-between h-header px-2 border-b',
    iconBtn: [
      'p-2 rounded-full hover:bg-muted',
      'text-muted-foreground transition-transform'
    ]
  },
})

const b = style()

function goToInstruction() {
  window.open('http://docx.3unlocked.com/admin', '_blank')
}
</script>

<template>
  <header :class="b.root()">
    <div class="flex items-center space-x-1">
      <button :class="b.iconBtn()" @click="iStore.toggleSidebar" accesskey="b">
        <Icon :icon="foldIcon" class="size-5" />
      </button>

      <Breadcrumb :items="iStore.breadcrumbItems" />
    </div>

    <div class="flex items-center space-x-1">
      <TodoMsg :ui-btn="b.iconBtn()" />

      <TheTheme ghost />

      <button :class="b.iconBtn()" accesskey="s" @click="$router.push('/settings')">
        <Icon icon="lucide:settings" class="size-5" />
      </button>

      <button :class="b.iconBtn()" accesskey="h" @click="goToInstruction">
        <Icon icon="mdi:help-circle-outline" class="size-5" />
      </button>
    </div>
  </header>
</template>
