<script setup lang="ts">
import DetailView from './DetailView.vue'
import DetailForm from './DetailForm.vue'
import DetailPay from './DetailPay.vue'

import type { DetailStatus } from '../utils/types'

interface DetailStep {
  key: 'view' | 'order' | 'pay',
  name: string,
}

const detailStatus = ref<DetailStatus>('view')

const component = defineComponentMap<Record<DetailStatus, Component>>({
  view: DetailView,
  order: DetailForm,
  pay: DetailPay,
})

const steps: DetailStep[] = [
  { key: 'view', name: '查看详情' },
  { key: 'order', name: '填写信息' },
  { key: 'pay', name: '确认支付' },
]

function defineComponentMap<T extends Record<string, Component>>(map: T) {
  return map
}

function handleClick(key: DetailStatus) {
  detailStatus.value = key
}

function handleNext(step: DetailStatus) {
  detailStatus.value = step
}

function handlePrev(step: DetailStatus) {
  detailStatus.value = step
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center mb-4 p-2">
      <template v-for="(step, index) in steps" :key="step.key">
        <button class="flex items-center flex-1" @click="handleClick(step.key)">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border-2"
            :class="[
              detailStatus === step.key
                ? 'bg-primary text-white border-primary'
                : 'border-zinc-400 text-zinc-500 dark:text-zinc-300',
            ]"
          >
            {{ index + 1 }}
          </div>

          <span
            class="ml-2 text-sm font-medium"
            :class="{
              'text-primary': detailStatus === step.key,
              'text-zinc-500 dark:text-zinc-400': detailStatus !== step.key,
            }"
          >
            {{ step.name }}
          </span>

          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-px bg-zinc-300 dark:bg-zinc-700 mx-2"
          ></div>
        </button>
      </template>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <component :is="component[detailStatus]" @next="handleNext" @prev="handlePrev" />
    </div>
  </div>
</template>
