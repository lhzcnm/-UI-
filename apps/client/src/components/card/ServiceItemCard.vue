<script setup lang="ts">
import type { ServiceView } from '@/api/services'
import { twJoin } from 'tailwind-merge'

const { data } = defineProps<{ data: ServiceView }>()

const { t } = useI18n()
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
            'bg-gradient-to-b from-primary to-blue-600 rounded-full shadow-sm'
          )"
        >{{ t('service.new') }} !</span>
      </h3>
      <div class="flex justify-end text-xs">
        <XTag color="danger">{{ t('service.point') }}: {{ data.price }}</XTag>
        <XTag color="success" class="ml-1">{{ data.taken }}</XTag>
      </div>
    </div>
    <div class="text-sm text-muted-foreground mt-1 text-ellipsis overflow-hidden" v-html="data.title" />
  </a>
</template>
