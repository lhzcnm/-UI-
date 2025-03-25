<script setup lang="ts">
import type { ServiceView } from '@/api/services'
import { twJoin } from 'tailwind-merge'

const { data } = defineProps<{ data: ServiceView }>()
</script>

<template>
  <a
    href="javascript:void(0)"
    class="block p-3 bg-card border hover:border-hover rounded-lg hover:shadow transition-colors"
  >
    <div class="flex items-center justify-between space-x-2">
      <h3 class="flex items-center space-x-2">
        <span class="font-bold" v-html="data.idHighlight || data.id" />
        <span 
          v-if="data.isNew" 
          :class="twJoin(
            'px-2 py-0.5 text-xs font-semibold text-white',
            'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-sm'
          )"
        >
          新!
        </span>
      </h3>
      <div class="flex justify-end text-xs">
        <XTag color="rose">积分 {{ data.price }}</XTag>
        <XTag color="emerald" class="ml-1">{{ data.taken }}</XTag>
      </div>
    </div>
    <div class="text-sm text-muted-foreground mt-1" v-html="data.title" />
  </a>
</template>
