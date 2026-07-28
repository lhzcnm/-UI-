import { ref, watch, type Ref } from 'vue'
import type { PreviewState } from '../types'

export function useImagePreview(): {
  previewState: Ref<PreviewState>
  scale: Ref<number>
  translateX: Ref<number>
  translateY: Ref<number>
  isDragging: Ref<boolean>
  imageContainer: Ref<HTMLDivElement | null>
  openPreview: (images: string[], index: number) => void
  closePreview: () => void
  prevImg: (e?: MouseEvent) => void
  nextImg: (e?: MouseEvent) => void
  goToIndex: (index: number) => void
  onWheel: (e: WheelEvent) => void
  onDoubleClick: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
  onTouchCancel: () => void
  handleKey: (e: KeyboardEvent) => void
  bindGlobalEvents: () => void
  unbindGlobalEvents: () => void
} {
  const previewState = ref<PreviewState>({
    visible: false,
    currentImg: '',
    images: [],
    currentIndex: 0
  })

  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const isDragging = ref(false)
  const dragStartX = ref(0)
  const dragStartY = ref(0)
  const dragStartTranslateX = ref(0)
  const dragStartTranslateY = ref(0)
  const imageContainer = ref<HTMLDivElement | null>(null)

  let lastTouchDistance = 0
  let lastScale = 1
  let wheelRafId: number | null = null
  let mouseMoveTicking = false

  // ---- 核心方法 ----
  function openPreview(images: string[], index: number) {
    if (!images.length) return
    const isSameGroup = previewState.value.images.join() === images.join()
    if (isSameGroup) {
      previewState.value.currentIndex = index
      previewState.value.currentImg = images[index]
      previewState.value.visible = true
      resetZoom()
      return
    }
    previewState.value = {
      visible: true,
      currentImg: images[index],
      images,
      currentIndex: index
    }
    resetZoom()
    bindGlobalEvents()
  }

  function closePreview() {
    previewState.value.visible = false
    resetZoom()
    unbindGlobalEvents()
  }

  function prevImg(e?: MouseEvent) {
    e?.stopPropagation()
    const { images, currentIndex } = previewState.value
    if (!images.length) return
    const newIndex = (currentIndex - 1 + images.length) % images.length
    updateCurrentImage(newIndex)
  }

  function nextImg(e?: MouseEvent) {
    e?.stopPropagation()
    const { images, currentIndex } = previewState.value
    if (!images.length) return
    const newIndex = (currentIndex + 1) % images.length
    updateCurrentImage(newIndex)
  }

  function goToIndex(index: number) {
    if (index === previewState.value.currentIndex) return
    updateCurrentImage(index)
  }

  function updateCurrentImage(index: number) {
    const images = previewState.value.images
    if (index < 0 || index >= images.length) return
    previewState.value.currentIndex = index
    previewState.value.currentImg = images[index]
    resetZoom()
  }

  // ---- 缩放拖拽 ----
  function clampPosition(x: number, y: number, s: number): [number, number] {
    if (s <= 1) return [0, 0]
    const container = imageContainer.value
    if (container) {
      const rect = container.getBoundingClientRect()
      const imgWidth = rect.width * s
      const imgHeight = rect.height * s
      const maxX = (imgWidth - rect.width) / 2
      const maxY = (imgHeight - rect.height) / 2
      return [
        Math.min(maxX, Math.max(-maxX, x)),
        Math.min(maxY, Math.max(-maxY, y))
      ]
    }
    const maxOffset = (s - 1) * 50
    return [
      Math.min(maxOffset, Math.max(-maxOffset, x)),
      Math.min(maxOffset, Math.max(-maxOffset, y))
    ]
  }

  function applyBoundaries() {
    const [clampedX, clampedY] = clampPosition(translateX.value, translateY.value, scale.value)
    translateX.value = clampedX
    translateY.value = clampedY
  }

  function resetZoom() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    if (wheelRafId !== null) return
    wheelRafId = window.requestAnimationFrame(() => {
      const delta = e.deltaY > 0 ? -0.2 : 0.2
      const newScale = Math.min(3, Math.max(1, scale.value + delta))
      scale.value = newScale
      applyBoundaries()
      wheelRafId = null
    })
  }

  function onDoubleClick(e: MouseEvent) {
    e.preventDefault()
    resetZoom()
  }

  function onMouseDown(e: MouseEvent) {
    if (scale.value <= 1 || e.button !== 0) return
    isDragging.value = true
    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
    dragStartTranslateX.value = translateX.value
    dragStartTranslateY.value = translateY.value
    e.preventDefault()
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging.value) return
    if (!mouseMoveTicking) {
      window.requestAnimationFrame(() => {
        const dx = e.clientX - dragStartX.value
        const dy = e.clientY - dragStartY.value
        const [clampedX, clampedY] = clampPosition(
          dragStartTranslateX.value + dx,
          dragStartTranslateY.value + dy,
          scale.value
        )
        translateX.value = clampedX
        translateY.value = clampedY
        mouseMoveTicking = false
      })
      mouseMoveTicking = true
    }
  }

  function onMouseUp(e: MouseEvent) {
    if (isDragging.value) {
      isDragging.value = false
      mouseMoveTicking = false
      e.preventDefault()
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      const t1 = e.touches[0]; const t2 = e.touches[1]
      lastTouchDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      lastScale = scale.value
      isDragging.value = false
    } else if (e.touches.length === 1 && scale.value > 1) {
      const touch = e.touches[0]
      isDragging.value = true
      dragStartX.value = touch.clientX
      dragStartY.value = touch.clientY
      dragStartTranslateX.value = translateX.value
      dragStartTranslateY.value = translateY.value
    }
    e.preventDefault()
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2) {
      const t1 = e.touches[0]; const t2 = e.touches[1]
      const distance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      const scaleFactor = distance / lastTouchDistance
      const newScale = Math.min(3, Math.max(1, lastScale * scaleFactor))
      scale.value = newScale
      applyBoundaries()
      e.preventDefault()
    } else if (e.touches.length === 1 && isDragging.value) {
      const touch = e.touches[0]
      const dx = touch.clientX - dragStartX.value
      const dy = touch.clientY - dragStartY.value
      const [clampedX, clampedY] = clampPosition(
        dragStartTranslateX.value + dx,
        dragStartTranslateY.value + dy,
        scale.value
      )
      translateX.value = clampedX
      translateY.value = clampedY
      e.preventDefault()
    }
  }

  function onTouchEnd() { isDragging.value = false }
  function onTouchCancel() { isDragging.value = false }

  function bindGlobalEvents() {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function unbindGlobalEvents() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  function handleKey(e: KeyboardEvent) {
    if (!previewState.value.visible) return
    switch (e.key) {
      case 'ArrowRight': nextImg(); break
      case 'ArrowLeft': prevImg(); break
      case 'Escape': closePreview(); break
    }
  }

  watch(scale, applyBoundaries)

  return {
    previewState,
    scale,
    translateX,
    translateY,
    isDragging,
    imageContainer,
    openPreview,
    closePreview,
    prevImg,
    nextImg,
    goToIndex,
    onWheel,
    onDoubleClick,
    onMouseDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    handleKey,
    bindGlobalEvents,
    unbindGlobalEvents
  }
}