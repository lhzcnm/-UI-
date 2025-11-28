<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Order } from '@/inters/order'
import { ORDER_STATUS, ORDER_STATUS_MAP, ua } from '@3un/utils'

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
const showTools = ref(false)

watch(copied, (val) => {
  if (val) toast.success(t('submit.success', { action: t('button.copy') }))
})

const orderResult = computed(() => {
  return order.result.split('<br>').join('\n')
})

function handleClick(str: string) {
  copy(str)
}

function openTools() {
  if (!ua.isDesktop) showTools.value = !showTools.value
}

function closeTools() {
  if (!ua.isDesktop) return
  showTools.value = false
}

const style = tv({
  slots: {
    card: [
      'relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5',
      'bg-white dark:bg-black shadow-sm transition-all duration-200',
      'hover:shadow-md'
    ],
    toolLayer: [
      'absolute top-2 right-2 flex flex-col space-y-2',
      'z-20'
    ],
    toolBtn: [
      'px-3 py-1 text-xs rounded-lg font-medium',
      'border border-zinc-300 dark:border-zinc-700',
      'bg-white dark:bg-zinc-900',
      'text-zinc-700 dark:text-zinc-200',
      'shadow-sm active:scale-95 transition'
    ]
  }
})

const b = style()
</script>

<template>
  <div
    :class="b.card()"
    @mouseenter="ua.isDesktop && (showTools = true)"
    @mouseleave="closeTools"
    @click="openTools"
  >
    <div class="flex justify-between items-center mb-2">
      <div class="font-medium">
        <span>IMEI/SN: </span>
        <span class="text-primary">{{ order.imei || t('unknown') }}</span>
      </div>
      <span class="text-sm whitespace-nowrap">{{ order.createTime }}</span>
    </div>

    <div class="text-md mb-4 leading-relaxed" v-html="order.result"></div>

    <div
      v-show="showTools"
      :class="b.toolLayer()"
      @click.stop
    >
      <button :class="b.toolBtn()" @click="handleClick(order.imei)">
        {{ t('order.copy.imei') }}
      </button>

      <button :class="b.toolBtn()" @click="handleClick(orderResult)">
        {{ t('order.copy.result') }}
      </button>

      <button
        v-if="order.status === ORDER_STATUS.FAILED"
        :class="b.toolBtn()"
        @click="emits('ticket', order.id)"
      >
        {{ t('ticket.title.create') }}
      </button>
    </div>

    <XTag
      class="absolute bottom-3 right-3"
      :color="ORDER_STATUS_MAP[order.status].color"
      :label="t(ORDER_STATUS_MAP[order.status].key!)"
    />
  </div>
</template>

