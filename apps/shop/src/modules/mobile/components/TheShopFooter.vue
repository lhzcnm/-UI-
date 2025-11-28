<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

const route = useRoute()
const { t } = useI18n()

const menus = [
  { name: t('shop.footer.shop'), icon: "lucide:home", path: "/shop/services", keyword: "_shop" },
  { name: t('shop.footer.profile'), icon: "lucide:users-round", path: "/shop/profile", keyword: "_profile" },
  { name: t('shop.footer.history'), icon: "lucide:list-ordered", path: "/shop/history", keyword: "_history" },
]
</script>

<template>
  <footer class="h-mobile-footer bg-card border-t">
    <nav class="flex items-center px-3">
      <template v-for="item in menus" :key="item.path">
        <RouterLink
          :to="item.path"
          :class="twMerge([
            'flex-1 flex flex-col items-center justify-center text-muted-foreground',
            route.name?.toString().endsWith(item.keyword) && 'text-primary'
          ])"
        >
          <Icon :icon="item.icon" class="size-6" />
          <span class="mt-1 text-xs">{{ item.name }}</span>
        </RouterLink>
      </template>
    </nav>
  </footer>
</template>
