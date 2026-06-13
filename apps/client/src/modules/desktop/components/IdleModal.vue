<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { tv } from 'tailwind-variants'

import { CHECK_INTERVAL, visibleInacvite } from '@/utils/heartBeat'
import { Icon } from '@iconify/vue'

const localStore = useLocalStore()

const COUNTDOWN = 3 * (CHECK_INTERVAL / 1000)

const count = ref(COUNTDOWN)
let timer: number | null = null

const style = tv({
  slots: {
    root: [
      'fixed inset-0 z-[60]',
      'flex items-center justify-center',
      'bg-black/50 backdrop-blur-sm',
      'transition-opacity duration-300'
    ],

    card: [
      'w-[420px] max-w-[90%]',
      'rounded-2xl',
      'bg-card/95 backdrop-blur',
      'border border-border/50',
      'shadow-2xl',
      'p-8',
      'flex flex-col items-center gap-5',
      'animate-in fade-in zoom-in-95 duration-200'
    ],

    icon: [
      'size-14',
      'text-warning',
      'p-3',
      'rounded-full',
      'bg-warning/10',
      'shadow-inner'
    ],

    desc: [
      'text-lg',
      'text-muted-foreground',
      'text-center',
      'leading-relaxed'
    ],

    countdown: [
      'text-4xl font-bold',
      'text-danger',
      'tracking-wide',
      'tabular-nums',
      'animate-pulse'
    ],
  }
})

const b = style()

function startCountdown() {
  stopCountdown()
  count.value = COUNTDOWN

  timer = window.setInterval(() => {
    count.value--

    if (count.value <= 0) {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const visible = computed(() => visibleInacvite.value)

onMounted(() => {
  watchVisible()
})

onUnmounted(() => {
  stopCountdown()
})

function watchVisible() {
  let last = visible.value

  setInterval(() => {
    if (visible.value !== last) {
      last = visible.value

      if (visible.value) {
        startCountdown()
      } else {
        stopCountdown()
      }
    }
  }, 200)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-in">
      <div v-if="visible" :class="b.root()">
        <div :class="b.card()">
          <Icon :class="b.icon()" icon="lucide:alert-triangle" />

          <div :class="b.desc()">
            {{ localStore.localData['top_Heartbeat'] }}
          </div>

          <div :class="b.countdown()">
            {{ count }} s
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
