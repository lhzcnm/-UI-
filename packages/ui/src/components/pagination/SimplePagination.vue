<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin, twMerge } from 'tailwind-merge'

interface SimplePaginationProps {
  total: number
  pageSize?: number
  hideOnSinglePage?: boolean
}

defineOptions({ name: 'XSimplePagination' })

const props = withDefaults(
  defineProps<SimplePaginationProps>(),
  {
    pageSize: 10,
    hideOnSinglePage: false,
  },
)

const current = defineModel({ default: 1 })

const lastPage = computed(() => Math.ceil(props.total / props.pageSize))
const hidden = computed(() => props.hideOnSinglePage && lastPage.value <= 1)

const isFirstPage = computed(() => current.value === 1)
const isLastPage = computed(() => current.value === lastPage.value)

const normalizedCurrent = computed({
  get: () => Math.max(1, Math.min(current.value, lastPage.value)),
  set: (val) => current.value = Math.max(1, Math.min(val, lastPage.value)),
})

function onPrev() {
  if (normalizedCurrent.value > 1)
    normalizedCurrent.value--
}

function onNext() {
  if (normalizedCurrent.value < lastPage.value)
    normalizedCurrent.value++
}
</script>

<template>
  <div v-if="!hidden" class="flex items-center space-x-2">
    <button
      :class="twJoin(
        'inline-flex items-center justify-center size-9 p-1',
        'bg-primary text-primary-foreground rounded shadow-sm',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      )"
      :disabled="isFirstPage"
      @click="onPrev"
    >
      <Icon icon="lucide:chevron-left" class="size-5" />
    </button>

    <div
      :class="twMerge(
        'flex items-center justify-center space-x-1.5 min-w-20 h-9 p-1',
        'text-center leading-7 bg-secondary rounded',
      )"
    >
      <span>{{ normalizedCurrent }}</span>
      <span>/</span>
      <span>{{ lastPage }}</span>
    </div>

    <button
      :class="twJoin(
        'inline-flex items-center justify-center size-9 p-1',
        'bg-primary text-primary-foreground rounded shadow-sm',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      )"
      :disabled="isLastPage || lastPage === 0"
      @click="onNext"
    >
      <Icon icon="lucide:chevron-right" class="size-5" />
    </button>
  </div>
</template>
