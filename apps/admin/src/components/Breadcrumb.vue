<script setup lang="ts">
import type { BreadcrumbItem } from '@/types'
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  homeIcon?: string
  homeTo?: string
}

interface BreadcrumbEmits {
  (e: 'clickHome'): void
}

const emit = defineEmits<BreadcrumbEmits>()

withDefaults(
  defineProps<BreadcrumbProps>(),
  {
    separator: '/',
    homeIcon: 'lucide:house',
    homeTo: '/',
  },
)
</script>

<template>
  <nav class="flex items-center gap-2">
    <div v-if="homeIcon" class="flex items-center">
      <button
        :class="twJoin(
          'flex items-center justify-center',
          'text-muted-foreground transition-colors',

        )"
        aria-label="Home"
        @click="emit('clickHome')"
      >
        <Icon :icon="homeIcon" class="size-5" />
      </button>
    </div>

    <template v-for="(item, index) in items" :key="index">
      <div
        v-if="index > 0 || homeIcon"
        class="flex items-center text-muted-foreground"
      >
        {{ separator }}
      </div>

      <div class="flex items-center">
        <template v-if="item.to">
          <router-link
            :to="item.to"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            <div class="flex items-center gap-1">
              <Icon v-if="item.icon" :icon="item.icon" class="size-5" />
              <span>{{ item.title }}</span>
            </div>
          </router-link>
        </template>
        <template v-else>
          <div class="flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
            <Icon v-if="item.icon" :icon="item.icon" class="size-5" />
            <span>{{ item.title }}</span>
          </div>
        </template>
      </div>
    </template>
  </nav>
</template>
