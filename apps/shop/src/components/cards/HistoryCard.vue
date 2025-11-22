<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Order } from '@/inters/order'
import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'

interface StoreHistoryCardProps {
  order: Order,
}

interface StoreOrderCardEmits {
  ticket: [id: number]
}

const { order } = defineProps<StoreHistoryCardProps>()

const emits = defineEmits<StoreOrderCardEmits>()

const { copy, copied } = useClipboard({})
const { t } = useI18n()
const isHover = ref(false)

watch(copied, (val) => {
  if (val) toast.success(t('submit.success', { action: t('button.copy') }))
})

const orderResult = computed(() => {
  return order.result.split('<br>').join('\n')
})

function handleClick(str: string) {
  copy(str)
}

const style = tv({
  slots: {
    card: [
      'relative rounded-2xl border border-border p-5 shadow-[0_0_15px_-15px_rgba(0,0,0,0.2)]',
      'bg-layer-light dark:bg-layer-dark backdrop-blur-lg transition-all duration-300',
      'hover:shadow-[0_20px_25px_-15px_rgba(0,0,0,0.25)] cursor-pointer'
    ],
    toolBox: [
      'flex flex-col space-y-3 items-center',
    ],
    tooltip: [
      'absolute inset-0 flex flex-col space-x-2 items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded-2xl',
      'text-xs text-zinc-700 dark:text-zinc-300 font-medium opacity-0 transition-opacity duration-200 select-none',
    ],
    tooltipVisible: ['opacity-100'],
    toolBtn: [
      'px-4 py-2 text-sm rounded-lg font-medium border border-zinc-300 dark:border-zinc-700',
      'bg-white/80 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 shadow-sm',
      'hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 hover:scale-105 active:scale-95',
      'backdrop-blur-sm'
    ],
  }
})

const b = style()
</script>

<template>
  <div
    :class="b.card()"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false">
    <div class="flex justify-between items-center mb-2">
      <div class="font-medium">
        <span>IMEI/SN: </span>
        <span class="text-primary">{{ order.imei || t('unknown') }}</span>
      </div>
      <span class="text-sm">{{ order.createTime }}</span>
    </div>
  
    <div class="text-md mb-2" v-html="order.result"></div>
  
    <!-- <div class="flex justify-between text-sm text-gray-500">
      <span>付款: {{ order.credits ?? 0 }} 元</span>
    </div> -->

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

    <!-- <div class="relative"> -->
      <XTag
        class="absolute bottom-4 right-4"
        :color="ORDER_STATUS_MAP[order.status].color"
        :label="t(ORDER_STATUS_MAP[order.status].key!)" />
    <!-- </div> -->
  </div>
</template>
