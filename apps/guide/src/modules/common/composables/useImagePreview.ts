import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

export interface PreviewState {
  visible: boolean
  currentImg: string
  images: string[]
  currentIndex: number
}

export function useImagePreview() {
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
  const imageContainer = ref<HTMLDivElement | null>(null)

  // 拖拽状态
  let dragStartX = 0
  let dragStartY = 0
  let dragStartTranslateX = 0
  let dragStartTranslateY = 0
  let isMouseDown = false
  
  // 触摸状态
  let lastTouchDistance = 0
  let lastScale = 1
  let isTouching = false

  // 重置所有状态
  function resetAllStates() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
    isDragging.value = false
    isMouseDown = false
    isTouching = false
  }

  // 打开预览
  function openPreview(images: string[], index: number) {
    if (!images.length) return
    
    // 完全重置
    resetAllStates()
    
    previewState.value = {
      visible: true,
      currentImg: images[index],
      images: images,
      currentIndex: index
    }
  }

  // 关闭预览
  function closePreview() {
    previewState.value.visible = false
    resetAllStates()
  }

  // 切换图片
  function prevImg(e?: MouseEvent) {
    e?.stopPropagation()
    if (!previewState.value.images.length) return
    const newIndex = (previewState.value.currentIndex - 1 + previewState.value.images.length) % previewState.value.images.length
    updateCurrentImage(newIndex)
  }

  function nextImg(e?: MouseEvent) {
    e?.stopPropagation()
    if (!previewState.value.images.length) return
    const newIndex = (previewState.value.currentIndex + 1) % previewState.value.images.length
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
    resetAllStates()
  }

  // 边界限制
  function applyBoundaries() {
    if (scale.value <= 1) {
      translateX.value = 0
      translateY.value = 0
      return
    }

    const container = imageContainer.value
    if (!container) return

    const rect = container.getBoundingClientRect()
    const maxX = (rect.width * (scale.value - 1)) / 2
    const maxY = (rect.height * (scale.value - 1)) / 2
    
    translateX.value = Math.max(-maxX, Math.min(maxX, translateX.value))
    translateY.value = Math.max(-maxY, Math.min(maxY, translateY.value))
  }

  // 滚轮缩放
  function onWheel(e: WheelEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(1, Math.min(3, scale.value + delta))
    
    if (newScale !== scale.value) {
      // 以鼠标位置为中心缩放
      const container = imageContainer.value
      if (container) {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        const ratio = newScale / scale.value
        translateX.value = translateX.value * ratio + x * (1 - ratio)
        translateY.value = translateY.value * ratio + y * (1 - ratio)
      }
      
      scale.value = newScale
      applyBoundaries()
    }
  }

  // 双击重置
  function onDoubleClick(e: MouseEvent) {
    e.preventDefault()
    resetAllStates()
  }

  // 鼠标事件
  function onMouseDown(e: MouseEvent) {
    if (scale.value <= 1 || e.button !== 0) {
      return
    }
    
    isMouseDown = true
    isDragging.value = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragStartTranslateX = translateX.value
    dragStartTranslateY = translateY.value
    
    e.preventDefault()
  }

  function onMouseMove(e: MouseEvent) {
    if (!isMouseDown || !isDragging.value) {
      return
    }
    
    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY
    
    translateX.value = dragStartTranslateX + dx
    translateY.value = dragStartTranslateY + dy
    
    applyBoundaries()
  }

  function onMouseUp(e: MouseEvent) {
    if (isMouseDown) {
      isMouseDown = false
      isDragging.value = false
    }
  }

  // 触摸事件
  function onTouchStart(e: TouchEvent) {
    const touches = e.touches
    
    if (touches.length === 1 && scale.value > 1) {
      // 单指拖拽
      isTouching = true
      isDragging.value = true
      const touch = touches[0]
      dragStartX = touch.clientX
      dragStartY = touch.clientY
      dragStartTranslateX = translateX.value
      dragStartTranslateY = translateY.value
    } else if (touches.length === 2) {
      // 双指缩放
      const t1 = touches[0]
      const t2 = touches[1]
      lastTouchDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      lastScale = scale.value
      isDragging.value = false
    }
    
    e.preventDefault()
  }

  function onTouchMove(e: TouchEvent) {
    const touches = e.touches
    
    if (touches.length === 1 && isTouching) {
      // 单指拖拽
      const touch = touches[0]
      const dx = touch.clientX - dragStartX
      const dy = touch.clientY - dragStartY
      
      translateX.value = dragStartTranslateX + dx
      translateY.value = dragStartTranslateY + dy
      
      applyBoundaries()
    } else if (touches.length === 2) {
      // 双指缩放
      const t1 = touches[0]
      const t2 = touches[1]
      const distance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      const scaleFactor = distance / lastTouchDistance
      const newScale = Math.max(1, Math.min(3, lastScale * scaleFactor))
      
      if (newScale !== scale.value) {
        // 以触摸点中心缩放
        const container = imageContainer.value
        if (container) {
          const rect = container.getBoundingClientRect()
          const cx = (t1.clientX + t2.clientX) / 2 - rect.left - rect.width / 2
          const cy = (t1.clientY + t2.clientY) / 2 - rect.top - rect.height / 2
          
          const ratio = newScale / scale.value
          translateX.value = translateX.value * ratio + cx * (1 - ratio)
          translateY.value = translateY.value * ratio + cy * (1 - ratio)
        }
        
        scale.value = newScale
        applyBoundaries()
      }
    }
    
    e.preventDefault()
  }

  function onTouchEnd() {
    isTouching = false
    isDragging.value = false
  }

  function onTouchCancel() {
    isTouching = false
    isDragging.value = false
  }

  // 键盘事件
  function handleKey(e: KeyboardEvent) {
    if (!previewState.value.visible) return
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        prevImg()
        break
      case 'ArrowRight':
        e.preventDefault()
        nextImg()
        break
      case 'Escape':
        e.preventDefault()
        closePreview()
        break
    }
  }

  // 监听 scale 变化，应用边界
  watch(scale, () => {
    applyBoundaries()
  })

  // 组件挂载时绑定全局事件
  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('keydown', handleKey)
  })

  // 组件卸载时移除全局事件
  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('keydown', handleKey)
  })

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
    applyBoundaries
  }
}
