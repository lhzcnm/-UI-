<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

interface SplitPlaneProps {
  split?: number
  min?: number
  max?: number
}

const props = withDefaults(
  defineProps<SplitPlaneProps>(),
  {
    split: 60,
    min: 40,
    max: 60,
  }
)

const container = ref<HTMLElement | null>(null)
const state = reactive({
  split: props.split,
  dragging: false,
})

const boundSplit = computed(() => {
  const { split } = state
  return split < props.min
    ? props.min
    : split > props.max
      ? props.max
      : split
})

let startPosition = 0
let startSplit = 0

function dragStart(e: MouseEvent) {
  state.dragging = true
  startPosition = e.pageX
  startSplit = boundSplit.value
}

function dragMove(e: MouseEvent) {
  if (state.dragging) {
    const position = e.pageX
    const totalSize = container.value!.offsetWidth
    const dp = position - startPosition
    state.split = startSplit + ~~((dp / totalSize) * 100)
  }
}

function dragEnd() {
  state.dragging = false
}
</script>

<template>
  <div
    ref="container" class="relative flex h-full"
    :class="{ 'cursor-ew-resize': state.dragging }"
    @mousemove="dragMove"
    @mouseleave="dragEnd"
    @mouseup="dragEnd"
  >
    <div
      class="relative h-full border-r border-dashed"
      :class="{ 'pointer-events-none': state.dragging }"
      :style="{ width: `${boundSplit}%` }"
    >
      <slot name="left" />
      <div
        :class="twJoin(
          'absolute top-0 bottom-0 right-[-2.5px] z-10 w-[5px]',
          'hover:bg-primary active:bg-primary cursor-ew-resize',
          'transition-all delay-200 duration-350'
        )"
        @mousedown.prevent="dragStart"
      />
    </div>
    <div
      class="relative h-full"
      :class="{ 'pointer-events-none': state.dragging }"
      :style="{ width: `${100 - boundSplit}%` }"
    >
      <slot name="right" />
    </div>
  </div>
</template>
