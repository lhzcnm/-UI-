<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

import type { SidebarMenu, SidebarMenuChild } from '@/utils'
import { EXPANDED_MENUS } from '@/utils'

interface SidebarItemProps {
  menu: SidebarMenu
}

const { menu } = defineProps<SidebarItemProps>()
const expandedMenus = inject<Ref<string[]>>(EXPANDED_MENUS)!

const router = useRouter()
const route = useRoute()
const iStore = useSystemStore()

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

  // no children, update breadcrumb
  iStore.breadcrumbItems = [menu.label]
  router.push(menu.path)
}

function handleChildClick(child: SidebarMenuChild, parentLabel: string) {
  iStore.breadcrumbItems = [parentLabel, child.label]
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
      :class="twMerge(
        'flex items-center justify-between w-full px-3 h-10 sm:h-8',
        'rounded hover:bg-accent transition-colors',
        isActive && 'bg-primary/20 text-primary hover:bg-primary/20',
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
      <ul class="flex flex-col sm:space-y-1">
        <li v-for="child in menu.children" :key="child.path">
          <RouterLink
            :to="child.path"
            :class="twMerge(
              'flex items-center px-3 h-9 sm:h-7 space-x-1',
              'rounded hover:bg-accent transition-colors',
              route.path === child.path && 'bg-primary/20 text-primary hover:bg-primary/20',
            )"
            @click="handleChildClick(child, menu.label)"
          >
            <span>{{ child.label }}</span>
            <Badge v-if="child.badge" :value="child.badge" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </li>
</template>
