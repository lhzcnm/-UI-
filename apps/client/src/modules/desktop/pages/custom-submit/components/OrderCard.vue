<script setup lang="ts">
import type { CustomSubmitOrder } from '@/api/orders'
import { ORDER_STATUS } from '@3un/utils'

interface OrderCardProps {
  order: CustomSubmitOrder,
}

interface OrderCardEmits {
  click: [order: CustomSubmitOrder]
}

const props = defineProps<OrderCardProps>()
const emits = defineEmits<OrderCardEmits>()

const displayStatusBg = computed(() => {
  let classes = `bg-success`
  
  if (props.order.status === ORDER_STATUS.PROCESSING) {
    classes = `bg-primary`
  } else if (props.order.status === ORDER_STATUS.FAILED) {
    classes = `bg-danger`
  } else if (props.order.status === ORDER_STATUS.WAIT) {
    classes = `bg-zinc-300 dark:bg-zinc-700`
  }

  return classes
})
</script>

<template>
  <div
    class="h-72 flex flex-col
           rounded-lg
           bg-slate-100 dark:bg-slate-800
           border border-slate-200 dark:border-slate-700
           shadow-sm"
    @click="emits('click', order)"
  >
    <!-- header -->
    <section
      class="px-3 py-2 w-full
             flex items-center justify-between"
    >
      <span class="text-sm font-medium tracking-wide">
        {{ order.imei }}
      </span>

      <span
        class="size-2.5 rounded-full"
        :class="displayStatusBg"
      />
    </section>

    <!-- divider -->
    <div class="h-px bg-slate-200 dark:bg-slate-700 mx-3" />

    <!-- fields -->
    <section class="px-3 py-2 flex flex-col gap-1.5">
      <div
        v-for="(value, key) in order.fields"
        :key="key"
        class="flex items-start text-xs leading-relaxed"
      >
        <span
          class="shrink-0
                 text-zinc-500
                 text-right pr-2"
        >
          {{ key }}
        </span>

        <div
          class="flex-1
                 text-zinc-900 dark:text-zinc-100
                 [&_span]:break-all"
          v-html="value"
        />
      </div>
    </section>
  </div>
</template>
