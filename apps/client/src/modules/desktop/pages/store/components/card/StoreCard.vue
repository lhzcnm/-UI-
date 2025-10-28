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
      "group flex flex-col p-6 rounded-2xl border border-white/30 dark:border-zinc-800 cursor-pointer",
      "bg-white dark:bg-zinc-900/40 backdrop-blur-xl",
      "transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02] hover:border-primary/30"
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
    :class="b.root()"
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
