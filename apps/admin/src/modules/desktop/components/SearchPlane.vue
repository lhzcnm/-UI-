<script setup lang="ts">
import RouteSearchItem from './RouteSearchItem.vue'
import ServiceSearchItem from './ServiceSearchItem.vue'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import type { ServiceView } from '@/interface/services'
import type { SidebarMenuChild } from '@/utils/sidebar'
import { menus, tools } from '@/utils/sidebar'

interface Options<T = any> {
  label: string
  value: string
  children: T[]
}

type SearchOptions = Options<SidebarMenuChild | ServiceView>

const visible = defineModel<boolean>({ required: true })

const router = useRouter()
const store = useServiceStore()
const search = ref('')

const _menus = menus.map(menu => {
  if (!menu.children) return menu
  return menu.children.map(child => {
    const path = `${menu.path}/${child.path}`
    return { ...child, path, icon: child.icon || menu.icon }
  })
})

const rawOptions: Options<SidebarMenuChild>[] = [
  { label: '工具', value: 'tool', children: tools },
  { label: '路由', value: 'route', children: _menus.flat() },
]

const options = computed<SearchOptions[]>(() => {
  const searchTerm = search.value.toLowerCase().trim()
  if (!searchTerm) return rawOptions

  // service
  if (!isNaN(Number(searchTerm)) && searchTerm.length <= 4) {
    return getSearchOptions(searchTerm)
  }

  // route & tool
  return getRouteOptions(searchTerm)
})

function getSearchOptions(searchTerm: string) {
  const service = store.items.filter(item =>
    item.packageId.toString().includes(searchTerm)
  )

  return [{
    label: '服务',
    value: 'service',
    children: service,
  }]
}

function getRouteOptions(searchTerm: string) {
  const _options = rawOptions.map(option => {
    const filteredChildren = option.children.filter(child => {
      const label = child.label.toLowerCase()
      if (label.includes(searchTerm)) return true

      const path = child.path.toLowerCase()
      if (path.includes(searchTerm)) return true

      if (!child.match) return false
      if (Array.isArray(child.match)) {
        return child.match.some((match) =>
          match.toLowerCase().includes(searchTerm)
        )
      }

      return child.match.toLowerCase().includes(searchTerm)
    })

    return {
      ...option,
      children: filteredChildren,
    }
  })

  return _options.filter(option => option.children.length > 0)
}

function handleCommand(command: string, event: MouseEvent) {
  if (command === 'tool' || command === 'route') {
    const target = event.target as HTMLElement
    const element = target.closest('[data-path]')
    if (!element) return

    const path = element.getAttribute('data-path')
    if (!path) return

    router.push(path)
  }

  if (command === 'service') {
    const target = event.target as HTMLElement
    const element = target.closest('[data-id]')
    if (!element) return

    // TODO: 跳转服务详情
  }

  visible.value = false
}
</script>

<template>
  <XDialog
    v-model="visible"
    content-class="sm:max-w-md p-0 sm:p-0 border"
  >
    <div class="relative border-b p-1">
      <Icon
        icon="lucide:search"
        class="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        v-model="search" placeholder="请输入..."
        :class="twJoin(
          'w-full h-10 sm:h-9 rounded-md pl-9 pr-2',
          'text-sm bg-transparent focus:outline-none'
        )"
        autofocus
      >
    </div>
    <div class="h-80 overflow-y-auto">
      <div
        v-for="option in options" :key="option.label"
        class="flex flex-col space-y-2 p-1.5 mt-2" 
      >
        <div class="pl-1.5 text-xs text-muted-foreground">{{ option.label }}</div>
        <ul
          class="flex flex-col space-y-1 text-sm"
          @click.stop="handleCommand(option.value, $event)"
        >
          <template v-if="['route', 'tool'].includes(option.value)">
            <RouteSearchItem
              v-for="child in (option as Options<SidebarMenuChild>).children"
              :key="child.path"
              :data-path="child.path"
              :child="child"
            />
          </template>
          <template v-else>
            <ServiceSearchItem
              v-for="child in (option as Options<ServiceView>).children"
              :key="child.packageId"
              :data-id="child.packageId"
              :child="child"
            />
          </template>
        </ul>
      </div>
      <div
        v-if="search && !options.length"
        class="p-4 text-sm text-center text-muted-foreground"
      >
        未找到匹配结果
      </div>
    </div>
  </XDialog>
</template>
