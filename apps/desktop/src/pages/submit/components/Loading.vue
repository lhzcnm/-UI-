<script setup lang="ts">
import { Icon } from '@iconify/vue'

const count = ref(0)

setInterval(() => {
  const _count = sessionStorage.getItem('submitCount')
  count.value = Number(_count)
}, 100)
</script>

<template>
  <div class="p-4 border rounded-md bg-card shadow-xl">
    <h3 class="flex items-center gap-2 text-lg font-medium">
      <Icon icon="lucide:loader" class="animate-spin" />
      订单处理中
    </h3>
    <p class="mt-2 text-sm text-muted-foreground">
      请稍等，剩余订单 <span class="font-medium">{{ count }}</span> 个
    </p>
  </div>
</template>
