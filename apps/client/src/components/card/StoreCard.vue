<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ClassNameValue } from 'tailwind-merge';
import { tv } from 'tailwind-variants'

interface StoreCardProps {
  id: number,
  price: string,
  title: string,
  desc: string | null,
  class?: ClassNameValue,
}

interface StoreCardEmits {
  submit: [id: number],
  view: [id: number],
}

const props = defineProps<StoreCardProps>()
const emits = defineEmits<StoreCardEmits>()

const style = tv({
  slots: {
    root: [
      "flex flex-col p-6 rounded-2xl border border-white/30 dark:border-zinc-800 cursor-pointer min-w-[320px]",
      "bg-white dark:bg-zinc-900/40 backdrop-blur-xl",
      "transition-all duration-300"
    ],
    price: [
      "text-xl font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-400 text-transparent bg-clip-text drop-shadow-sm"
    ]
  }
})

const b = style()

function stripHtml(html: string | null) {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerText || div.textContent || ''
}
</script>

<template>
  <div
    :class="b.root({ class: props.class })"
    @click="emits('submit', id)">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-semibold line-clamp-2 tracking-tight text-zinc-800 dark:text-zinc-100">
        {{ title }}
      </h3>
    </div>

    <div class="flex-1 overflow-hidden text-sm line-clamp-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
      {{ stripHtml(desc) }}
    </div>

    <div class="flex mt-auto justify-between items-center pt-3">
      <h3 v-if="price" :class="b.price()">
        ￥{{ price }}
      </h3>
      <button
        class="relative flex items-center space-x-1 text-primary/80 hover:text-primary transition-all duration-300">
        <Icon class="size-5 group-hover:animate-arrow-move transition-transform" icon="lucide:move-right" />
      </button>
    </div>
  </div>
</template>
