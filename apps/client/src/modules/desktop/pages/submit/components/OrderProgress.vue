<script setup lang="ts">
import { orderApi, type OrderProgressResp } from '@/api/orders'
import { SUBMIT_STORE } from '../utils'
import { Icon } from '@iconify/vue';

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

const progressData = ref<OrderProgressResp>()

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
  return serviceStore.services.get(store.selectId)
})

watch(
  () => store.selectId,
  async () => {
    stopTimer()
    progressData.value = undefined
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
    progressData.value = undefined
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

    progressData.value = data
    if (data.total === 0 || (data.processing === 0 && data.waiting === 0)) {
      stopTimer()
      store.visibleGress = false
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

  console.log(successChanged)
  console.log(failedChanged)

  if (
    (successChanged !== 0
      || failedChanged !== 0)
    && store.rawOrders.length > 0
  ) {
    console.log("has Change")
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

const orderStatusData = computed(() => {
  const localData = localStore.localData || {}
  
  return [
    {
      label: localData["submit_ordergress_success"] || '成功',
      value: progressData.value!.success || 0,
      class: 'text-success bg-green-400/10'
    },
    {
      label: localData["submit_ordergress_failed"] || '失败',
      value: progressData.value!.failed || 0,
      class: 'text-danger bg-red-400/10'
    },
    {
      label: localData["submit_ordergress_processing"] || '处理中',
      value: progressData.value!.processing || 0,
      class: 'text-primary bg-blue-400/10'
    },
    {
      label: localData["submit_ordergress_waiting"] || '待处理',
      value: progressData.value!.waiting || 0,
      class: 'text-warning bg-yellow-400/10'
    }
  ]
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
  <div v-if="progressData && store.visibleGress" ref="cardRef"
    class="fixed z-50 w-64 rounded-xl bg-card shadow-xl border hover:scale-[1.03]" :class="{
      'scale-[0.97]': dragging,
    }" :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      backgroundColor: dragging
        ? 'color-mix(in srgb, hsl(var(--card)) 70%, transparent)'
        : undefined,
    }">
    <div class="flex items-center justify-center px-4 py-3 border-b border-dashed cursor-move select-none relative"
      @mousedown="startDrag">
      <span class="font-semibold">
        {{ localStore.localData["submit_ordergress_title"] }}
      </span>

      <Icon @click="collapsed = !collapsed" :icon="collapsed ? 'gridicons:plus-small' : 'gridicons:minus-small'"
        class="text-gray-400 absolute right-4 size-5" />
    </div>

    <div v-if="!collapsed" class="p-4 pb-0 space-y-2">
      <section class="grid-cols-2 gap-2 grid">
        <div class="flex flex-col justify-center items-center  rounded-md p-2" v-for="item in orderStatusData" :key="item.label" :class="item.class">
          <span class="text-sm">
            {{ item.label }}
          </span>
          <b>
            {{ item.value }}
          </b>
        </div>  
      </section>

      <p class="text-sm text-center text-muted-foreground">{{ localStore.localData["submit_ordergress_autoclean_tip"] }}
      </p>

      <div class="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div class="h-full bg-primary" :style="{
          width:
            `${((progressData.success + progressData.failed)
              / progressData.total * 100) || 0}%`
        }" />
      </div>
    </div>

     <div class="flex justify-between bg-sky-500/10 px-4 py-2 border-b text-sky-500 rounded-md m-2">
      <span>{{ localStore.localData["submit_ordergress_total"] }}</span>
      <b>
        {{ progressData.total }}
      </b>
    </div>
  </div>
</template>
