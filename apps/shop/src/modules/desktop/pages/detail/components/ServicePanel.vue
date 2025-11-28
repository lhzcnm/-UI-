<script setup lang="ts">
import type { OrderView } from '@/inters/order'

interface ServicePanelProps {
  orders: OrderView[],
}

defineProps<ServicePanelProps>()

const emits = defineEmits(['ticket'])
</script>

<template>
  <aside class="h-full border-l border-zinc-200 dark:border-zinc-700 flex flex-col overflow-y-auto">
    
    <div class="px-4 py-3 flex items-center text-sm text-zinc-400 gap-2">
      <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      <span>{{ $t('shop.result') }}</span>
      <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
    </div>

    <div class="px-4 pb-4 flex-1 h-full space-y-4 overflow-y-auto">
      <OrderCard
        v-for="(order, index) in orders" :key="order.id" 
        :order="order" :index="index"
        @ticket="emits('ticket', order.id)"
      />
    </div>
  </aside>
</template>

