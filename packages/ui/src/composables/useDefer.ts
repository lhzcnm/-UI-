export default function useDefer() {
  const frameCount = ref(0)
  function updateFrameCount() {
    requestAnimationFrame(() => {
      frameCount.value++
      updateFrameCount()
    })
  }
  updateFrameCount()
  return function defer(n: number) {
    return frameCount.value >= n
  }
}
