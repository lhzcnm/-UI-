<script setup lang="ts">
import { ref } from 'vue'
import type { ContentItem } from '../types'

const props = defineProps<{
  contentList: ContentItem[]
}>()

const emit = defineEmits<{
  (e: 'preview', images: string[], index: number): void
  (e: 'link-click', payload: { id: string; linkElement: HTMLElement }): void
}>()

const contentRef = ref<HTMLElement | null>(null)

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement

  // ===== 1. 点击关闭按钮 → 移除容器 =====
  const closeBtn = target.closest('.close-gallery')
  if (closeBtn) {
    const container = closeBtn.closest('.image-gallery-container') as HTMLElement | null
    if (container) {
      container.remove()
    }
    e.preventDefault()
    return
  }

  // ===== 2. 点击图片缩略图 → 全屏预览 =====
  const imgEl = target.closest('.gallery-image') as HTMLElement | null
  if (imgEl) {
    e.preventDefault()
    e.stopPropagation()
    const container = imgEl.closest('.image-gallery-container') as HTMLElement | null
    if (!container) return
    const itemId = container.dataset.itemId
    const item = props.contentList.find(i => i.value === itemId)
    if (!item || !item.images || !item.images.length) return
    const src = imgEl.dataset.src   // 现在 imgEl 已断言为 HTMLElement，dataset 可用
    const index = item.images.findIndex(img => img.imageUrl === src)
    if (index >= 0) {
      emit('preview', item.images.map(img => img.imageUrl), index)
    }
    return
  }

  // ===== 3. 点击链接 → 触发 link-click 事件 =====
  const link = target.closest('a') as HTMLElement | null
  if (link) {
    e.preventDefault()
    const section = link.closest('[id]') as HTMLElement | null
    if (!section) return
    const id = section.id
    emit('link-click', { id, linkElement: link })
    return
  }

  // ===== 4. 点击普通图片（非缩略图） → 尝试预览 =====
  if (target.tagName === 'IMG') {
    const section = target.closest('[id]') as HTMLElement | null
    if (section) {
      const id = section.id
      const item = props.contentList.find(item => item.value === id)
      if (item?.images?.length) {
        const imageUrls = item.images.map(img => img.imageUrl)
        const idx = imageUrls.findIndex(url => url === (target as HTMLImageElement).src)
        emit('preview', imageUrls, idx >= 0 ? idx : 0)
        return
      }
    }
    // Fallback
    const imgs = Array.from(contentRef.value?.querySelectorAll('img') || []) as HTMLImageElement[]
    const imageUrls = imgs.map(i => i.src)
    const idx = imageUrls.findIndex(src => src === (target as HTMLImageElement).src)
    if (imageUrls.length) {
      emit('preview', imageUrls, idx >= 0 ? idx : 0)
    }
  }
}

defineExpose({ contentRef })
</script>

<template>
  <div ref="contentRef" @click="handleContentClick">
    <div
      v-for="item in contentList"
      :key="item.value"
      :id="item.value"
      class="bg-white/20 w-full pt-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32"
    >
      <div class="doc-content max-w-4xl mx-auto text-gray-700 leading-relaxed py-4"
        v-html="item.content"></div>
    </div>
  </div>
</template>