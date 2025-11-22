<script setup lang="ts">
import { Icon } from '@iconify/vue'
import LanuageSwitchView from '../tool/LanuageSwitchView.vue'
import ServiceGroupView from '../tool/ServiceGroupView.vue'
import TimeDisplay from '../tool/TimeDisplay.vue'
import RootTool from '../tool/RootTool.vue'
import OrderSearchView from '../tool/OrderSearchView.vue'

import { TOOL_STORE, ToolStatus, type ToolGlobalStore } from '../utils'

const store = reactive<ToolGlobalStore>({
  toolStatus: ToolStatus.ROOT,
})

provide(TOOL_STORE, store)

const showPhone = defineModel<boolean>({ required: true })
const dragging = ref(false)
const pos = ref({ x: 0, y: 0 })
const offset = ref({ x: 0, y: 0 })
const buttonRef = ref<HTMLButtonElement | null>(null)

const BASE_WIDTH = 600
const BASE_HEIGHT = 983

const phoneWidth = ref(BASE_WIDTH)
const phoneHeight = ref(BASE_HEIGHT)
const MARGIN = 10

let preventClick = false

watch(
  () => showPhone.value,
  () => {
    store.toolStatus = ToolStatus.ROOT
  }
)

const phonePosition = computed(() => {
  let left = pos.value.x - phoneWidth.value
  let top = pos.value.y - phoneHeight.value

  if (left < MARGIN) left = pos.value.x + 80
  if (top < MARGIN) top = pos.value.y + 80
  if (left + phoneWidth.value + MARGIN > window.innerWidth)
    left = window.innerWidth - phoneWidth.value - MARGIN
  if (top + phoneHeight.value + MARGIN > window.innerHeight)
    top = window.innerHeight - phoneHeight.value - MARGIN

  return { left: `${left}px`, top: `${top}px` }
})

function togglePhone() {
  if (preventClick) {
    return
  }
  showPhone.value = !showPhone.value
}

function handleMouseDown(e: MouseEvent) {
  if (!buttonRef.value) return

  dragging.value = false
  const startX = e.clientX
  const startY = e.clientY
  const rect = buttonRef.value.getBoundingClientRect()
  offset.value = {
    x: startX - rect.left,
    y: startY - rect.top,
  }

  function handleMouseMove(e: MouseEvent) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragging.value = true
      preventClick = true
    }
    if (dragging.value) {
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      const dragX = e.clientX - offset.value.x
      const dragY = e.clientY - offset.value.y

      pos.value.x = Math.max(0, Math.min(dragX, maxX))
      pos.value.y = Math.max(0, Math.min(dragY, maxY))
    }
  }

  function handleMouseUp() {
    setTimeout(() => {
      preventClick = false
    }, 0)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function defineComponentMap<T extends Record<ToolStatus, Component>>(map: T) {
  return map
}

function updatePhoneSize() {
  const screenW = window.innerWidth
  const screenH = window.innerHeight

  const scale = Math.min(
    screenW / (BASE_WIDTH + 40),
    screenH / (BASE_HEIGHT + 40),
    1
  )

  phoneWidth.value = BASE_WIDTH * scale
  phoneHeight.value = BASE_HEIGHT * scale
}


const component = defineComponentMap<Record<ToolStatus, Component>>({
  [ToolStatus.ROOT]: RootTool,
  [ToolStatus.LANGUAGE]: LanuageSwitchView,
  [ToolStatus.GROUP]: ServiceGroupView,
  [ToolStatus.ORDER]: OrderSearchView,
})

onMounted(() => {
  updatePhoneSize()
  window.addEventListener('resize', updatePhoneSize)
  const w = window.innerWidth
  const h = window.innerHeight
  pos.value.x = w - 100
  pos.value.y = h - 100
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePhoneSize)
})
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="fixed z-40 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center cursor-pointer transition-transform active:scale-90"
    :class="{ 'cursor-move': dragging }"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
    @mousedown="handleMouseDown"
    @click.stop="togglePhone"
  >
    <Icon class="size-6" icon="lucide:smartphone" />
  </button>

  <teleport to="body">
    <transition name="fade-scale">
      <div v-if="showPhone" class="fixed z-40" :style="phonePosition">
        <div
          class="relative rounded-[2rem] border-4 border-zinc-700 dark:border-zinc-400 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col items-center overflow-hidden transition-transform duration-300"
          :style="{ width: `${phoneWidth}px`, height: `${phoneHeight}px` }"
        >
          <div class="h-8 bg-transparent flex items-center justify-center">
            <div class="w-16 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full"></div>
          </div>

          <div class="w-full h-8 pl-2 flex justify-between items-center">
            <TimeDisplay />
          </div>

          <Transition name="slide-right">
            <component :is="component[store.toolStatus]" />
          </Transition>

          <div class="h-16 mt-auto w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <button
              class="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 transition"
              @click="togglePhone"
            ></button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
