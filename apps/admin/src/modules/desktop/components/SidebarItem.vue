<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import type { SidebarMenu } from '@/utils'
import { EXPANDED_MENUS } from '@/utils'

interface SidebarItemProps {
  menu: SidebarMenu
}

const { menu } = defineProps<SidebarItemProps>()
const expandedMenus = inject<Ref<string[]>>(EXPANDED_MENUS)!

const router = useRouter()
const route = useRoute()

function toggleExpand(path: string) {
  const index = expandedMenus.value.indexOf(path)
  if (index === -1) expandedMenus.value.push(path)
  else expandedMenus.value.splice(index, 1)

  const stringify = JSON.stringify(expandedMenus.value)
  localStorage.setItem('expanded-menus', stringify)
}

function handleClick(menu: SidebarMenu) {
  if (menu.children) {
    toggleExpand(menu.path)
    return
  }

  router.push(menu.path)
}

const isExpanded = computed(() => 
  expandedMenus.value.includes(menu.path)
)

const isActive = computed(() => {
  if (!menu.children) return route.path === menu.path
  return !isExpanded.value && route.path.startsWith(menu.path)
})
</script>

<template>
  <li>
    <button
      :class="twJoin(
        'flex items-center justify-between w-full px-3 h-8',
        'rounded-md hover:bg-muted hover:text-accent-foreground',
        isActive && 'bg-muted text-accent-foreground',
      )"
      @click="handleClick(menu)"
    >
      <div class="flex items-center space-x-2">
        <Icon v-if="menu.icon" :icon="menu.icon" class="size-4" />
        <span>{{ menu.label }}</span>
        <Badge v-if="menu.badge" :value="menu.badge" />
      </div>
      <Icon
        v-if="menu.children"
        :rotate="expandedMenus.includes(menu.path) ? 45 : 0"
        icon="lucide:chevron-right"  class="size-4"
      />
    </button>

    <div
      v-show="menu.children && isExpanded"
      class="mx-5 mt-1 pl-2 text-sm border-l border-dashed"
    >
      <ul class="flex flex-col space-y-1">
        <li v-for="child in menu.children" :key="child.path">
          <RouterLink
            :to="child.path"
            :class="twJoin(
              'flex items-center px-3 h-7 space-x-1',
              'rounded-md hover:bg-muted hover:text-accent-foreground',
              route.path === child.path && 'bg-muted text-accent-foreground',
            )"
          >
            <span>{{ child.label }}</span>
            <Badge v-if="child.badge" :value="child.badge" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </li>
</template>
