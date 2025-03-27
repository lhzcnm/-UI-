<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface Menu {
  label: string
  path: string
  icon: string
  children?: MenuChild[]
}

interface MenuChild {
  label: string
  path: string
}

const { menus } = defineProps<{ menus: Menu[] }>()

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()

const expandedMenus = ref<string[]>([])

onBeforeMount(() => {
  const config = localStorage.getItem('expanded-menus')
  if (config) expandedMenus.value = JSON.parse(config)
})

const currentPath = computed(() => {
  let cur = route.path

  for (const menu of menus) {
    if (!menu) continue
    if (menu.path === '/') continue

    const isStartWith = cur.startsWith(menu.path)
    if (isStartWith && cur.length > menu.path.length) {
      cur = menu.path
    }
  }

  return cur
})

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

function toggleExpand(path: string) {
  const index = expandedMenus.value.indexOf(path)
  if (index === -1) expandedMenus.value.push(path)
  else expandedMenus.value.splice(index, 1)

  const stringify = JSON.stringify(expandedMenus.value)
  localStorage.setItem('expanded-menus', stringify)
}

function handleClick(menu: Menu) {
  if (menu.children) {
    toggleExpand(menu.path)
    return
  }

  systemStore.breadcrumbItems = [
    {
      title: menu.label,
      to: menu.path,
    },
  ]
  
  router.push(menu.path)
}
</script>

<template>
  <aside class="flex flex-col w-sidebar border-r border-dashed">
    <div class="flex items-center px-4 h-header">
      <TheLogo height="1.5rem" />
    </div>

    <nav class="flex-1 overflow-y-auto p-2 text-muted-foreground">
      <ul class="flex flex-col space-y-1">
        <li v-for="menu in _menus" :key="menu.path">
          <button
            :class="twJoin(
              'flex items-center justify-between w-full px-3 h-8',
              'rounded-md hover:bg-muted hover:text-accent-foreground',
              !menu.children && currentPath === menu.path && 'bg-muted text-accent-foreground',
            )"
            @click="handleClick(menu)"
          >
            <div class="flex items-center space-x-2">
              <Icon v-if="menu.icon" :icon="menu.icon" class="size-4" />
              <span>{{ menu.label }}</span>
            </div>
            <Icon
              v-if="menu.children"
              :rotate="expandedMenus.includes(menu.path) ? 45 : 0"
              icon="lucide:chevron-right"  class="size-4"
            />
          </button>

          <div
            v-show="menu.children && expandedMenus.includes(menu.path)"
            class="mx-5 mt-1 pl-2 text-sm border-l border-dashed"
          >
            <ul class="flex flex-col space-y-1">
              <li v-for="child in menu.children" :key="child.path">
                <RouterLink
                  :to="child.path"
                  :class="twJoin(
                    'flex items-center px-3 h-7',
                    'rounded-md hover:bg-muted hover:text-accent-foreground',
                    route.path === child.path && 'bg-muted text-accent-foreground',
                  )"
                >
                  <span>{{ child.label }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>
