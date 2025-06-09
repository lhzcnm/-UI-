<script setup lang="ts">
import SearchRouteItem from './SearchRouteItem.vue'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { isNumeric } from '@3un/ui'

import type { SidebarMenuChild } from '@/utils/sidebar'
import { menus, tools } from '@/utils/sidebar'

interface Options<T = any> {
  label: string
  value: string
  children: T[]
}

type SearchOptions = Options<SidebarMenuChild>

const visible = defineModel<boolean>({ required: true })

const route = useRoute()
const router = useRouter()
const iStore = useSystemStore()

const search = ref('')

const _menus = menus.map(menu => {
  if (!menu.children) return menu
  return menu.children.map(child => ({
    ...child, icon: child.icon || menu.icon,
  }))
})

const routeOptions: Options<SidebarMenuChild>[] = [
  { label: '工具', value: 'tool', children: tools },
  { label: '路由', value: 'route', children: _menus.flat() },
]

const searchOptions: Options<SidebarMenuChild>[] = [
  {
    label: '搜索服务',
    value: 'recommend',
    children: [
      { label: '服务ID', path: '/service/items?id', icon: 'lucide:package-search' },
    ]
  },
  {
    label: '搜索订单',
    value: 'recommend',
    children: [
      { label: 'IMEI/SN', path: '/orders?imei', icon: 'lucide:shopping-bag' },
      { label: '用户ID', path: '/orders?uid', icon: 'lucide:shopping-bag' },
    ]
  },
  {
    label: '搜索用户',
    value: 'recommend',
    children: [
      { label: '用户ID', path: '/users?uid', icon: 'lucide:user-round-search' },
    ]
  },
  {
    label: '搜索充值记录',
    value: 'recommend',
    children: [
      { label: '用户ID', path: '/recharge?uid', icon: 'lucide:user-round-search' },
    ]
  },
  {
    label: '搜索登录日志',
    value: 'recommend',
    children: [
      { label: '用户ID', path: '/logs?uid', icon: 'lucide:user-round-search' },
      { label: 'IP地址', path: '/logs?ip', icon: 'lucide:user-round-search' },
    ]
  },
  {
    label: '搜索积分记录',
    value: 'recommend',
    children: [
      { label: '用户ID', path: '/credits?uid', icon: 'lucide:credit-card' },
      { label: '服务ID', path: '/credits?sid', icon: 'lucide:credit-card' },
    ]
  },
]

const options = computed<SearchOptions[]>(() => {
  const searchTerm = search.value.trim().toLowerCase()
  if (!searchTerm) return routeOptions

  let result: SearchOptions[] = []
  if (!isNumeric(searchTerm)) {
    result = getRouteOptions(searchTerm)
  }

  if (result.length > 0) return result
  return searchOptions
})

function getRouteOptions(searchTerm: string) {
  const _options = routeOptions.map(option => {
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

async function handleCommand(command: string, event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-path]')!
  const path = element.getAttribute('data-path')!

  iStore.isGlobalSearch = true

  // tool & route
  if (command === 'tool' || command === 'route') {
    await router.push(path)
  }

  if (command === 'recommend') {
    const [base, flag] = path.split('?')

    let extra = route.query
    if (base === '/service/items') {
      extra = { cid: route.query.cid }
    }

    const query = { ...extra, [flag]: search.value.trim() }
    await router.push({ path: base, query })
  }

  visible.value = false
  iStore.isGlobalSearch = false
}
</script>

<template>
  <XDialog
    v-model="visible"
    uiRoot="sm:max-w-md p-0 sm:p-0 border"
    @close="search = ''"
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
          'text-base bg-transparent focus:outline-none'
        )"
        autofocus
      >
    </div>
    <div class="h-96 overflow-y-auto">
      <div
        v-for="option in options" :key="option.label"
        class="flex flex-col p-1.5 mt-2" 
      >
        <div class="pl-1.5 text-sm text-muted-foreground mb-1">{{ option.label }}</div>
        <ul
          class="flex flex-col space-y-1 text-sm"
          @click.stop="handleCommand(option.value, $event)"
        >
          <SearchRouteItem
            v-for="child in option.children" :key="child.path"
            :data-path="child.path" :child="child"
          />
        </ul>
      </div>
    </div>
  </XDialog>
</template>
