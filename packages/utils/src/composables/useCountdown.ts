import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

interface UseCountdownOptions {
  initialSeconds?: number
  storageKey?: string
}

export function useCountdown({
  initialSeconds = 60,
  storageKey = 'countdown',
}: UseCountdownOptions = {}) {
  const timerRef = ref<number>()
  const count = ref(0)
  let startTime = 0

  const isRunning = computed(() => count.value > 0)

  const startCountdown = () => {
    startTime = Date.now()
    count.value = initialSeconds
    sessionStorage.setItem(storageKey, String(startTime))
  }

  onMounted(() => {
    const savedStore = sessionStorage.getItem(storageKey)
    if (!savedStore) return

    const store = +savedStore
    const diff = Math.floor((Date.now() - store) / 1000)
    if (diff >= initialSeconds) return clear()

    count.value = initialSeconds - diff
    startTime = store
  })

  watch(count, (newCount) => {
    if (newCount <= 0) return clear()
    timerRef.value = window.setTimeout(() => count.value--, 1000)
  })

  function clear() {
    if (timerRef.value) window.clearInterval(timerRef.value)
    sessionStorage.removeItem(storageKey)
  }

  onBeforeUnmount(() => {
    if (timerRef.value) {
      window.clearInterval(timerRef.value)
    }
  })

  return {
    count,
    isRunning,
    startCountdown,
  }
}
