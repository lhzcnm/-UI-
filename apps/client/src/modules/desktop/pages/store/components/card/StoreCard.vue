<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { twJoin } from 'tailwind-merge'

interface StoreCardProps {
  id: number,
  price: number,
  title: string,
  desc: string | null,
}

interface StoreCardEmits {
  submit: [id: number]
}

defineProps<StoreCardProps>()
const emits = defineEmits<StoreCardEmits>()

function stripHtml(html: string | null) {
  if(!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  return div.innerText || div.textContent || ''
}
</script>

<template>
  <div
    :class="twJoin(
      'p-4 border border-border rounded-2xl flex bg-card',
      'flex-col shadow-sm hover:shadow-md transition space-y-2'
    )"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold leading-snug break-words line-clamp-2">
        {{ title }}
      </h3>
      <h3 v-if="price" class="text-lg font-bold text-danger">
        ￥{{ price }}
      </h3>
    </div>
    <div class="flex-1 overflow-hidden line-clamp-4">
      {{ stripHtml(desc) }}
    </div>
    <div class="flex justify-between items-center text-sm text-muted-foreground">
      <button class="flex items-center space-x-1 hover:text-foreground transition">
        <Icon icon="lucide:eye" class="w-4 h-4" />
        <span>查看详情</span>
      </button>
      <button
        class="flex items-center space-x-1 text-danger hover:text-danger/80 transition"
        @click="emits('submit', id)">
        <Icon icon="lucide:shopping-cart" class="w-4 h-4" />
        <span>下单</span>
      </button>
    </div>
  </div>
</template>
