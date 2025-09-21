<script setup lang="ts">
import type { Component } from 'vue'

import type { Order } from '@/api/orders'

interface OrderVoucherProps {
  order: Order,
  component: Component,
}

const props = defineProps<OrderVoucherProps>()
</script>

<template>
  <div :id="`order${order.id}`">
    <div class="bg-background shadow-md border border-border p-6 mx-auto">
      <div class="relative flex justify-center items-center">
        <div class="scale-95">
            <component :is="props.component" :order />
        </div>
      </div>
    </div>
  </div>
</template>
