<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'
import { ua } from '@3un/utils'

import type { SidebarMenu, SidebarMenuChild } from '@/utils'
import { EXPANDED_MENUS } from '@/utils'

interface SidebarItemProps {
  menu: SidebarMenu
}

const { menu } = defineProps<SidebarItemProps>()
const expandedMenus = inject<Ref<string[]>>(EXPANDED_MENUS)!

const route = useRoute()
const router = useRouter()
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

  if (ua.isMobile) iStore.showSidebar = false

  // no children, update breadcrumb
  iStore.breadcrumbItems = [menu.label]
  router.push(menu.path)
}

function handleChildClick(child: SidebarMenuChild, parentLabel: string) {
  if (ua.isMobile) iStore.showSidebar = false
  iStore.breadcrumbItems = [parentLabel, child.label]
}

const isExpanded = computed(() => 
  expandedMenus.value.includes(menu.path)
)

const isActive = computed(() => {
  const curPath = route.path.replace(/^\/m/, '')
  if (!menu.children) return curPath === menu.path
  return !isExpanded.value && curPath.startsWith(menu.path)
})

function isActiveChild(child: SidebarMenuChild) {
  const curPath = route.fullPath.replace(/^\/m/, '')
  const [path, query] = curPath.split('?')
  const search = new URLSearchParams(query)
  const match = search.get('q')

  if (!match) return path === child.path
  return child.path === `${path}?q=${match}`
}
</script>

<template>
  <li>
    <button
      :class="twMerge(
        'flex items-center justify-between w-full px-3 h-10 sm:h-8',
        'rounded hover:bg-accent/15 hover:text-foreground transition-colors',
        isActive && 'bg-accent/15 text-foreground',
      )"
      @click="handleClick(menu)"
    >
      <div class="flex items-center space-x-2">
        <Icon v-if="menu.icon" :icon="menu.icon" class="size-4" />
        <span>{{ menu.label }}</span>
        <XBadge
          v-if="menu.badge && menu.badge()"
          :value="menu.badge()"
          color="success"
          size="sm"
        />
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
              'rounded hover:bg-accent/15 hover:text-foreground transition-colors',
              isActiveChild(child) && 'bg-accent/15 text-foreground',
            )"
            @click="handleChildClick(child, menu.label)"
          >
            <span>{{ child.label }}</span>
            <XBadge
              v-if="child.badge && child.badge()"
              :value="child.badge()"
              color="success"
              size="sm"
            />
          </RouterLink>
        </li>
      </ul>
    </div>
  </li>
</template>
