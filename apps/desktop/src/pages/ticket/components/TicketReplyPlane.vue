<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { TICKET_STORE } from '../utils'
import NoMessage from './NoMessage.vue';

const store = inject(TICKET_STORE)!
</script>

<template>
  <div class="flex-1 flex flex-col gap-4 p-4 bg-card border rounded-lg">
    <NoMessage v-if="!store.index" />
    <template v-else>
      <section class="flex items-center border-b border-dashed pb-3">
        <h2 class="text-lg font-bold">工单主题</h2>
      </section>
      <section class="flex-1 flex flex-col gap-4">
        <div class="flex-1 flex flex-col gap-4">
          
        </div>
        <div class="flex gap-2 border-t pt-3">
          <textarea
            rows="5"
            placeholder="请输入回复内容"
            :class="twMerge(
              'w-full h-full pl-2 text-base sm:text-sm bg-transparent',
              'resize-none focus:outline-none'
            )"
          />
          <XButton label="发送" />
        </div>
      </section>
    </template>
  </div>
</template>
