<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { menus, tools, EXPANDED_MENUS } from '@/utils'

const expandedMenus = ref<string[]>([])
provide(EXPANDED_MENUS, expandedMenus)

const _menus = computed(() => {
  return menus.map(menu => {
    if (!menu.children) return menu

    const children = menu.children.map(child => {
      const path = `${menu.path}/${child.path}`
      return { ...child, path }
    })

    return {
      ...menu,
      children,
    }
  })
})

onBeforeMount(() => {
  const config = localStorage.getItem('expanded-menus')
  if (config) expandedMenus.value = JSON.parse(config)
})
</script>

<template>
  <aside class="flex flex-col w-sidebar border-r border-dashed">
    <div class="flex items-center px-4 h-header">
      <TheLogo height="1.5rem" />
    </div>

    <nav class="flex-1 overflow-y-auto p-2 text-muted-foreground">
      <ul class="flex flex-col space-y-1">
        <SidebarItem
          v-for="menu in _menus"
          :key="menu.path"
          :menu="menu"
        />
      </ul>

      <p class="mt-6 mb-2 pl-3 text-xs text-muted-foreground">工具</p>
      <ul class="flex flex-col space-y-1">
        <li v-for="tool in tools" :key="tool.path">
          <button
            :class="twJoin(
              'flex items-center justify-between w-full px-3 h-8',
              'rounded-md hover:bg-muted hover:text-accent-foreground',
            )"
          >
            <div class="flex items-center space-x-2">
              <Icon v-if="tool.icon" :icon="tool.icon" class="size-4" />
              <span>{{ tool.label }}</span>
            </div>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
