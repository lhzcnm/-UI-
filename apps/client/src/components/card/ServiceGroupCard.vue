<script setup lang="ts">
import type { ServiceDetail } from '@/api/services'
import { twMerge } from 'tailwind-merge'

interface ServiceGroupCardProps {
  group: ServiceDetail
}

defineProps<ServiceGroupCardProps>()

const localStore = useLocalStore()
</script>

<template>
  <a 
    href="javascript:void(0)" 
    :class="twMerge(
      'group relative overflow-hidden block bg-white p-5 md:p-6 rounded-2xl border border-slate-100',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      'hover:shadow-[0_10px_28px_-8px_rgba(199,0,11,0.12)] hover:-translate-y-0.5 hover:border-[#C7000B]/20',
      'transition-all duration-250 cursor-pointer flex justify-between items-center'
    )"
  >
    <!-- 悬停微光 -->
    <div class="absolute -right-8 -top-8 w-28 h-28 bg-[#C7000B]/0 rounded-full blur-2xl group-hover:bg-[#C7000B]/[0.06] transition-all duration-500 pointer-events-none"></div>

    <div class="relative z-10 flex flex-col gap-1.5 min-w-0 pr-3">
      <h3 class="font-semibold text-[15px] md:text-base tracking-tight text-slate-800 group-hover:text-[#C7000B] transition-colors duration-250 truncate">
        {{ group.title }}
      </h3>
      <span class="text-[13px] text-slate-400 font-medium">
        {{ localStore.localeSlotVal('submit_ServiceNum', { '{count}': group.children.length }) }}
      </span>
    </div>

    <!-- 箭头 -->
    <div class="relative z-10 shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#C7000B] transition-colors duration-250">
      <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </a>
</template>