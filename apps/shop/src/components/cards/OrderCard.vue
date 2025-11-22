<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'
import { ref, watch } from 'vue'
import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'
import type { OrderView } from '@/inters/order'

interface StoreOrderCardProps {
  order: OrderView,
  index: number,
}

interface StoreOrderCardEmits {
  ticket: [id: number]
}

const props = defineProps<StoreOrderCardProps>()
const emits = defineEmits<StoreOrderCardEmits>()

const { copy, copied } = useClipboard({})
const { t } = useI18n()
const isHover = ref(false)

watch(copied, (val) => {
  if (val) toast.success(t('submit.success', { action: t('button.copy') }))
})

const orderResult = computed(() => {
  return props.order.result.split('<br>').join('\n')
})

function randomHsl(baseHue = 220) {
  const h = baseHue + Math.floor(Math.random() * 20 - 10)
  const s = Math.floor(Math.random() * 10) + 75
  const l = Math.floor(Math.random() * 10) + 50
  return `hsl(${h}, ${s}%, ${l}%)`
}

const color = randomHsl(220)

const style = tv({
  slots: {
    root: [
      'relative rounded-2xl border border-border p-5 shadow-[0_0_15px_-15px_rgba(0,0,0,0.2)]',
      'bg-layer-light dark:bg-layer-dark backdrop-blur-lg transition-all duration-300',
      'hover:shadow-[0_20px_25px_-15px_rgba(0,0,0,0.25)] cursor-pointer'
    ],
    index: [
      'absolute top-1 left-1 text-xs text-white font-semibold px-3 py-1 rounded-lg shadow-md select-none z-10'
    ],
    content: [
      'text-sm text-zinc-600 dark:text-zinc-300 leading-6 space-y-1 mt-2 whitespace-pre-line'
    ],
    tooltip: [
      'absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded-2xl',
      'text-xs text-zinc-700 dark:text-zinc-300 font-medium opacity-0 transition-opacity duration-200 select-none',
    ],
    tooltipVisible: ['opacity-100'],
    toolBox: [
      'flex flex-col space-y-3 items-center',
    ],
    toolBtn: [
      'px-4 py-2 text-sm rounded-lg font-medium border border-zinc-300 dark:border-zinc-700',
      'bg-white/80 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 shadow-sm',
      'hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 hover:scale-105 active:scale-95',
      'backdrop-blur-sm'
    ],
    input: [
      'bg-transparent p-2 focus:ring-1 focus:ring-primary focus:outline-none border border-zinc-300 dark:border-zinc-700',
      'rounded-lg'
    ]
  }
})

const b = style()

function handleClick(str: string) {
  copy(str)
}
</script>

<template>
  <div
    :class="b.root()"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div :class="b.index()" :style="{ backgroundColor: color }">
      #{{ index + 1 }}
    </div>

    <div :class="b.content()" v-html="orderResult"></div>

    <XTag
      class="absolute bottom-3 right-4"
      :color="ORDER_STATUS_MAP[order.status].color"
      :label="t(ORDER_STATUS_MAP[order.status].key!)" />

    <div
      :class="[b.tooltip(), isHover && b.tooltipVisible()]"
    >
      <div
        :class="b.toolBox()">
        <button
          :class="b.toolBtn()"
          @click.stop="handleClick(order.imei)">
          {{ t('order.copy.imei') }}
        </button>
        <button
          :class="b.toolBtn()"
          @click.stop="handleClick(orderResult)">
          {{ t('order.copy.result') }}
        </button>
        <button
          :class="b.toolBtn()"
          v-if="order.status === ORDER_STATUS.FAILED"
          @click.stop="emits('ticket', order.id)">
          {{ t('ticket.title.create') }}
        </button>
      </div>
    </div>
  </div>
</template>
