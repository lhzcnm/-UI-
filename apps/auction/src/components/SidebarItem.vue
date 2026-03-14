<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { tv } from 'tailwind-variants'

import type { MenuItem } from '@/inters/basic/sidebar'

interface SideBarItemProps {
  menu: MenuItem
}

const { menu } = defineProps<SideBarItemProps>()

const route = useRoute()
const router = useRouter()

const isActive = computed(() =>
  route.path === menu.route || route.path.startsWith(menu.route + '/')
)

const style = tv({
  slots: {
    wrapper: 'relative group',
    indicator: [
      'absolute left-0 top-1/2 -translate-y-1/2',
      'h-6 w-1 rounded-full bg-primary',
      'opacity-0 scale-y-75 transition-all',
    ],
    base: [
      'flex items-center w-full h-10 px-4 rounded-lg',
      'text-sm font-medium',
      'text-muted-foreground',
      'transition-all duration-200',
      'hover:bg-accent/20 hover:text-foreground',
      'group-hover:translate-x-0.5',
    ],
    icon: 'size-4 shrink-0 transition-colors',
    label: 'ml-3 truncate',
  },
  variants: {
    isActive: {
      true: {
        base: 'bg-accent/10 text-foreground',
        indicator: 'opacity-100 scale-y-100',
        icon: 'text-primary',
      }
    }
  }
})

const b = style()

function handleClick(route: string) {
  router.push(route)
}
</script>

<template>
  <div :class="b.wrapper()">
    <span :class="b.indicator({ isActive })" />

    <button :class="b.base({ isActive })" @click="handleClick(menu.route)">
      <Icon :icon="menu.icon" :class="b.icon({ isActive })" />
      <span :class="b.label()">
        {{ menu.label }}
      </span>
    </button>
  </div>
</template>
