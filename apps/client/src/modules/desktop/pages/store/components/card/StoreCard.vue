<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { tv } from 'tailwind-variants'

interface StoreCardProps {
  id: number,
  price: string,
  title: string,
  desc: string | null,
}

interface StoreCardEmits {
  submit: [id: number],
  view: [id: number],
}

defineProps<StoreCardProps>()
const emits = defineEmits<StoreCardEmits>()

const style = tv({
  slots: {
    root: [
      "flex flex-col p-5 pb-1 rounded-2xl border border-primary/20 bg-white/70 transition-all duration-300 backdrop-blur-md cursor-pointer",
      "dark:bg-slate-900/60 hover:border-primary/40 hover:shadow-lg"
    ],
    price: [
      "text-xl font-bold bg-gradient-to-r from-rose-500 to-orange-400 text-transparent bg-clip-text"
    ]
  }
})

const b = style()
// const { t } = useI18n()

function stripHtml(html: string | null) {
  if(!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html

  return div.innerText || div.textContent || ''
}
</script>

<template>
  <div :class="b.root()"
    @click="emits('submit', id)">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold line-clamp-2">{{ title }}</h3>
      <h3 v-if="price" :class="b.price()">
        ￥{{ price }}
      </h3>
    </div>
    <div class="flex-1 overflow-hidden text-sm line-clamp-4">
      {{ stripHtml(desc) }}
    </div>
    <div class="flex mt-auto justify-between items-center text-sm text-gray-500">
      <!-- <button class="flex items-center space-x-1 transition"
              @click="emits('view', id)" v-if="desc">
        <Icon icon="lucide:eye" class="w-5 h-5" />
        <span>{{ t('store.service.view') }}</span>
      </button> -->
      <button class="ml-auto flex items-center space-x-1 text-danger transition p-2 px-4 rounded-full">
        <Icon class="size-8" icon="lucide:move-right" />
      </button>
    </div>
  </div>
</template>
