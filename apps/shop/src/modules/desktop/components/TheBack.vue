<script setup lang="ts">
import { tv } from 'tailwind-variants'

import { Icon } from '@iconify/vue'

const router = useRouter()
const { t } = useI18n()

function handleClick() {
  router.go(-1)
}

const style = tv({
  slots: {
    root: [
      "flex w-20 items-center gap-1.5 px-2 h-8 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300",
      "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    ]
  }
})

const b = style()
</script>

<template>
  <button
    :class="b.root()"
    @click="handleClick">
    <Icon icon="lucide:step-back" class="size-4" />
    <span class="text-sm">{{ t('shop.back') }}</span>
  </button>
</template>
