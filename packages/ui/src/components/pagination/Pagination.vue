<script setup lang="ts">
import XPageControl from './XPageControl.vue'
import XPageJumper from './XPageJumper.vue'
import XPageSizes from './XPageSizes.vue'
import XPager from './XPager.vue'

import type { PaginationProps } from './pagination'

defineOptions({ name: 'XPagination' })

const props = withDefaults(
  defineProps<PaginationProps>(),
  {
    pagerCount: 7,
    fixWidth: true,
    hideOnSinglePage: false,
    sizes: () => [20, 50, 100, 200, 500],
    layouts: () => ['prev', 'pager', 'next'],
  },
)

const size = defineModel('size', { default: 10 })
const current = defineModel({ default: 1 })

const lastPage = computed(() => Math.ceil(props.total / size.value))
const hidden = computed(() => props.hideOnSinglePage && lastPage.value <= 1)

const isFirstPage = computed(() => current.value === 1)
const isLastPage = computed(() => current.value === lastPage.value)

const normalizedCurrent = computed({
  get: () => Math.max(1, Math.min(current.value, lastPage.value)),
  set: (val) => current.value = Math.max(1, Math.min(val, lastPage.value)),
})

const halfPagerCount = Math.ceil(props.pagerCount / 2)
const middlePageIndex = Math.floor((props.pagerCount - 2) / 2)

const isShowMore = computed(() => lastPage.value > props.pagerCount)
const showBeforeMore = computed(() => isShowMore.value && normalizedCurrent.value > halfPagerCount)
const showAfterMore = computed(() => isShowMore.value && normalizedCurrent.value + halfPagerCount <= lastPage.value)

const pages = computed(() => {
  const result = [] as number[]
  let cur = normalizedCurrent.value

  if (cur > halfPagerCount) {
    while (cur + middlePageIndex + 1 > lastPage.value) cur--

    const min = cur - middlePageIndex
    const max = cur + middlePageIndex
    const index = props.fixWidth && showAfterMore.value ? min + 1 : min

    for (let i = index; i <= max; i++) {
      if (i > 1 && i < lastPage.value)
        result.push(i)
    }
  }
  else {
    for (let i = 2; i < props.pagerCount; i++) {
      if (i < lastPage.value)
        result.push(i)
    }
  }

  return result
})

function onPrev() {
  if (normalizedCurrent.value > 1)
    normalizedCurrent.value--
}

function onNext() {
  if (normalizedCurrent.value < lastPage.value)
    normalizedCurrent.value++
}

function handleCurrentChange(e: MouseEvent) {
  const target = e.target as HTMLElement

  if (target.classList.contains('item'))
    normalizedCurrent.value = Number(target.textContent)
}

function handleMore(mode: 'prev' | 'next') {
  const carry = props.pagerCount - (props.fixWidth ? 3 : 2)

  if (mode === 'prev') {
    const target = normalizedCurrent.value - carry
    normalizedCurrent.value = target > 1 ? target : 1
  }
  else {
    const target = normalizedCurrent.value + carry
    normalizedCurrent.value = target < lastPage.value ? target : lastPage.value
  }
}

function handleJumperChange(e: Event) {
  const target = e.target as HTMLInputElement
  normalizedCurrent.value = Number(target.value)
  console.log(normalizedCurrent.value)
}
</script>

<template>
  <div v-if="!hidden" class="flex items-center gap-2 whitespace-nowrap">
    <template v-for="layout in layouts">
      <div v-if="layout === 'total'">
        共 {{ total }} 条
      </div>

      <XPager
        v-if="layout === 'pager'"
        :pages="pages"
        :current="normalizedCurrent"
        :last-page="lastPage"
        :is-first-page="isFirstPage"
        :is-last-page="isLastPage"
        :show-after-more="showAfterMore"
        :show-before-more="showBeforeMore"
        @more="handleMore"
        @click="handleCurrentChange"
      />

      <XPageControl
        v-if="layout === 'prev'"
        type="prev" :disabled="isFirstPage"
        @click="onPrev"
      />

      <XPageControl
        v-if="layout === 'next'"
        type="next" :disabled="isLastPage || lastPage === 0"
        @click="onNext"
      />

      <XPageJumper
        v-if="layout === 'jumper'"
        :model-value="normalizedCurrent"
        @change="handleJumperChange"
      />

      <XPageSizes
        v-if="layout === 'sizes'"
        v-model="size" :sizes="sizes"
      />
    </template>
  </div>
</template>
