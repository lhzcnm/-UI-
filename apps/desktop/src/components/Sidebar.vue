<script setup lang="ts">
import type { SidebarMenus } from '@3un/shared'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{ menus: SidebarMenus[] }>()

const route = useRoute()
const router = useRouter()
const wsStore = useWsStore()

const currentPath = computed(() => {
  let cur = route.path

  for (const menu of props.menus) {
    if (menu.path.length === 1) continue

    const isStartWith = cur.startsWith(menu.path)
    if (isStartWith && cur.length > menu.path.length) {
      cur = menu.path
    }
  }

  return cur
})

function handle(path: string) {
  wsStore.close()
  router.push(path)
}
</script>

<template>
  <aside class="h-full px-4">
    <a
      v-for="menu in menus" :key="menu.path"
      href="javascript:void(0)"
      :class="twMerge(
        'flex items-center gap-2 px-3 py-2 mb-1',
        'rounded-lg whitespace-nowrap text-muted-foreground',
        'cursor-pointer transition-all duration-200',
        'hover:bg-primary/20 hover:text-primary',
        currentPath === menu.path && 'bg-primary/20 text-primary',
      )"
      @click="handle(menu.path)"
    >
      <component :is="menu.icon" />{{ menu.label }}
    </a>
  </aside>
</template>
