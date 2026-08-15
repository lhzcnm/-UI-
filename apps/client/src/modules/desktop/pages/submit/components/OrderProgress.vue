<script setup lang="ts">
import { orderApi, type OrderProgressResp } from '@/api/orders'
import { defaultGress, SUBMIT_STORE } from '../utils'

interface CompareDataItem {
  success: number,
  failed: number,
}

interface OrderProgressEmits {
  changed: []
}

const store = inject(SUBMIT_STORE)!

const emits = defineEmits<OrderProgressEmits>()

const serviceStore = useServiceStore()
const localStore = useLocalStore()

const cardRef = ref<HTMLElement | null>(null)
const hasChange = ref<boolean>(true)

// const progressData = ref<OrderProgressResp>()

const position = reactive({
  x: window.innerWidth - 300,
  y: 80
})

const collapsed = ref(false)
const dragging = ref(false)

const offset = {
  x: 0,
  y: 0
}

const cache = localStorage.getItem(
  'order-progress-position'
)

let timer: number | undefined
let lastProgress: CompareDataItem = {
  success: 0,
  failed: 0
}

if (cache) {
  Object.assign(
    position,
    JSON.parse(cache)
  )
}

const service = computed(() => {
  console.log(serviceStore.services.get(store.selectId))
  return serviceStore.services.get(store.selectId)
})

const visible = computed(() => store.visibleGress && hasChange.value)

watch(
  () => store.selectId,
  async () => {
    stopTimer()
    store.visibleGress = false
    store.progressData = defaultGress
    lastProgress = { success: 0, failed: 0 }
    await getProgressStatus()
  },
  {
    immediate: true
  }
)

watch(
  () => store.refreshProgress,
  async () => {
    stopTimer()
    lastProgress = { success: 0, failed: 0 }
    await getProgressStatus()
  },
  { immediate: true }
)

async function getProgressStatus() {
  if (!service.value) return

  try {
    const { data } = await orderApi.orderProgress({
      serviceId: store.selectId
    })
  
    store.progressData = data
    if (data.total === 0 || (data.processing === 0 && data.waiting === 0)) {
      stopTimer()
    } else {
      startTimer()
      store.visibleGress = true
    }
  
    compareData(data)
  } catch {
    stopTimer()
  }
}

function startTimer() {
  stopTimer()
  timer = window.setInterval(() => {
    getProgressStatus()
  }, 9000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}

function startDrag(e: MouseEvent) {
  dragging.value = true

  offset.x = e.clientX - position.x
  offset.y = e.clientY - position.y

  window.addEventListener(
    'mousemove',
    move
  )

  window.addEventListener(
    'mouseup',
    stopDrag
  )
}

function move(e: MouseEvent) {
  if (!dragging.value) {
    return
  }

  position.x = e.clientX - offset.x
  position.y = e.clientY - offset.y

  clampPosition()
}

function stopDrag() {
  dragging.value = false

  localStorage.setItem(
    'order-progress-position',
    JSON.stringify(position)
  )

  window.removeEventListener(
    'mousemove',
    move
  )

  window.removeEventListener(
    'mouseup',
    stopDrag
  )
}

function compareData(data: OrderProgressResp) {
  const lastSuccess = lastProgress.success
  const lastFailed = lastProgress.failed

  const successChanged = data.success - lastSuccess
  const failedChanged = data.failed - lastFailed

  if (
    (successChanged !== 0
    || failedChanged !== 0)
    && store.rawOrders.length > 0
  ) {
    hasChange.value = true
    emits('changed')
  }

  lastProgress = {
    success: data.success,
    failed: data.failed,
  }
}

function handleResize() {
  clampPosition()
}

function clampPosition() {
  const rect = cardRef.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  const maxX = Math.max(
    0,
    window.innerWidth - rect.width
  )

  const maxY = Math.max(
    0,
    window.innerHeight - rect.height
  )

  position.x = Math.min(
    Math.max(position.x, 0),
    maxX
  )

  position.y = Math.min(
    Math.max(position.y, 0),
    maxY
  )
}

onMounted(() => {
  nextTick(() => {
    if (!cache) {
      const rect = cardRef.value?.getBoundingClientRect()

      if (rect) {
        position.x = Math.max(
          0,
          window.innerWidth - rect.width - 16
        )
      }
    }

    handleResize()
  })

  window.addEventListener(
    'resize',
    handleResize
  )
})

onUnmounted(() => {
  stopTimer()

  window.removeEventListener(
    'resize',
    handleResize
  )
})
</script>

<template>
  <div
    v-if="visible"
    ref="cardRef"
    class="fixed z-50 w-64 rounded-xl bg-card shadow-xl border hover:scale-[1.03]"
    :class="{
      'scale-[0.97]': dragging,
    }"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      backgroundColor: dragging
        ? 'color-mix(in srgb, hsl(var(--card)) 70%, transparent)'
        : undefined,
    }"
  >
    <div
      class="flex items-center justify-between px-4 py-3 border-b cursor-move select-none"
      @mousedown="startDrag"
    >
      <span class="font-semibold">
        {{ localStore.localData["submit_ordergress_title"] }}
      </span>

      <button class="text-gray-400" @click="collapsed = !collapsed">
        {{ collapsed ? '□' : '−' }}
      </button>
    </div>

    <div v-if="!collapsed" class="p-4 space-y-3">
      <div class="flex justify-between">
        <span>{{ localStore.localData["submit_ordergress_total"] }}</span>
        <b>
          {{ store.progressData.total }}
        </b>
      </div>

      <div class="flex justify-between text-success">
        <span>{{ localStore.localData["submit_ordergress_success"] }}</span>
        <b>
          {{ store.progressData.success }}
        </b>
      </div>

      <div class="flex justify-between text-danger">
        <span>{{ localStore.localData["submit_ordergress_failed"] }}</span>
        <b>
          {{ store.progressData.failed }} / {{ store.progressData.reject }}
        </b>
      </div>

      <div class="flex justify-between text-primary">
        <span>{{ localStore.localData["submit_ordergress_processing"] }}</span>
        <b>
          {{ store.progressData.processing }}
        </b>
      </div>

      <div class="flex justify-between text-warning">
        <span>{{ localStore.localData["submit_ordergress_waiting"] }}</span>
        <b>
          {{ store.progressData.waiting }}
        </b>
      </div>

      <p class="text-sm text-center">{{ localStore.localData["submit_ordergress_autoclean_tip"] }}</p>

      <div class="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          class="h-full bg-primary"
          :style="{
          width:
            `${((store.progressData.success + store.progressData.failed)
              / store.progressData.total * 100) || 0}%`
        }" />
      </div>
    </div>
  </div>
</template>
