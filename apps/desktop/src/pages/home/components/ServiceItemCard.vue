<script setup lang="ts">
import type { Service } from '@3un/shared/services'

defineProps<{ data: Service }>()
</script>

<template>
  <a
    href="javascript:void(0)"
    class="p-3 border hover:border-hover rounded-lg hover:shadow transition-colors"
    @click="$router.push(`/submit/${data.id}`)"
  >
    <div class="flex items-center justify-between">
      <h3 class="flex items-center gap-2">
        <span class="font-bold" v-html="data.id" />
        <mark v-if="data.isNew" class="text-xs text-blue-500 bg-blue-500/10 px-1.5 py-1 rounded">New</mark>
      </h3>
      <div class="flex items-center gap-2 text-xs">
        <span class="text-red-500 bg-red-500/10 px-1.5 py-1 rounded">积分 {{ data.price }}</span>
        <span class="text-emerald-500 bg-emerald-500/10 px-1.5 py-1 rounded">{{ data.timeTaken }}</span>
      </div>
    </div>
    <div class="text-sm text-muted-foreground mt-1" v-html="data.name" />
  </a>
</template>
