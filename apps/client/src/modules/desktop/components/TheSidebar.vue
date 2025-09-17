<script setup lang="ts">
import type { SidebarMenu } from '../types'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@iconify/vue'

const props = defineProps<{ menus: SidebarMenu[] }>()

const route = useRoute()
const router = useRouter()
const wsStore = useWsStore()
const iStore = useSystemStore()

// const isLogout = defineModel({ required: true })

const currentPath = computed(() => {
  let cur = route.path

  for (const menu of props.menus) {
    if (!menu) continue
    if (menu.path === '/') continue

    const isStartWith = cur.startsWith(menu.path)
    if (isStartWith && cur.length > menu.path.length) {
      cur = menu.path
    }
  }

  return cur
})

function handle(path: string) {
  if(path.includes('logout')) {
    iStore.logout = true
    return
  }
  wsStore.close()
  router.push(path)
}
</script>

<template>
  <aside class="w-sidebar p-4 flex flex-col">
    <template v-for="menu in menus" :key="menu.path">
      <a
        v-if="!menu.hide"
        href="javascript:void(0)"
        :class="twMerge(
          'flex items-center space-x-2 px-3 py-2 mb-1',
          'rounded-lg whitespace-nowrap text-muted-foreground',
          'cursor-pointer transition-all duration-200',
          'hover:bg-primary/20 hover:text-primary',
          currentPath === menu.path && 'bg-primary/20 dark:bg-primary/30 text-primary',
          menu.path.includes('logout') && 'mt-auto hover:bg-danger/20 hover:text-danger'
        )"
        @click="handle(menu.path)"
      >
        <Icon :icon="menu.icon" class="size-5" />
        <span>{{ menu.label }}</span>
      </a>
    </template>
  </aside>
</template>
