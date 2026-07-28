<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
    <header class="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
      <div class="flex items-center h-14 px-4 max-w-3xl mx-auto">
        <button @click="drawerOpen = true" class="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span class="flex-1 text-center font-semibold text-gray-900 dark:text-white text-sm truncate">{{ getMenuNameById(activeId) || '产品说明书' }}</span>
        <div class="w-10"></div>
      </div>
    </header>

    <Drawer
      ref="drawerRef"
      :open="drawerOpen"
      @close="drawerOpen = false"
      @select="handleMenuSelect"
    />

    <main class="pt-14 max-w-3xl mx-auto px-4 py-6">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="!contentList.length" class="text-center text-gray-500 py-20">
        <p class="text-sm">请从左侧目录选择功能</p>
      </div>
      <ContentRenderer
        v-else
        ref="contentRendererRef"
        :content-list="contentList"
        @preview="openPreview"
        @link-click="handleLinkClick"
      />
    </main>

    <MobileImagePreview ref="previewRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Drawer from '../common/components/Drawer.vue'
import ContentRenderer from '../common/components/ContentRenderer.vue'
import MobileImagePreview from '../common/components/MobileImagePreview.vue'
import { useMenu } from '../common/composables/useMenu.js'
import { useContent } from '../common/composables/useContent.js'
import { menusAdminMobile } from '@/utils/menu'
import '../common/styles/doc-content.css'

const drawerRef = ref<InstanceType<typeof Drawer>>()
const contentRendererRef = ref<InstanceType<typeof ContentRenderer>>()
const previewRef = ref<InstanceType<typeof MobileImagePreview>>()
const drawerOpen = ref(false)

const { activeId, getMenuNameById, setActive } = useMenu(menusAdminMobile)
const { contentList, loading, loadContent } = useContent()

function openPreview(images: string[], index: number) {
  previewRef.value?.openPreview(images, index)
}

// ===== 修复：移除清除所有容器的代码，支持多个容器同时展开 =====
function handleLinkClick(payload: { id: string; linkElement: HTMLElement }) {
  const { id, linkElement } = payload
  const item = contentList.value.find(item => item.value === id)
  if (!item || !item.images || !item.images.length) return

  // 检查该链接后面是否已有图片容器
  let existing = linkElement.nextElementSibling as HTMLElement | null
  while (existing && existing.classList?.contains('image-gallery-container')) {
    existing.remove()
    return // 已存在则移除（收起），不操作其他容器
  }

  // 插入新容器（不移除其他已存在的容器）
  const html = buildGalleryHTML(item, id)
  linkElement.insertAdjacentHTML('afterend', html)
}
// ===== 修复结束 =====

// 构建图片容器 HTML（与原移动端逻辑一致）
function buildGalleryHTML(item: any, id: string): string {
  if (!item.images || !item.images.length) return ''
  const imagesHtml = item.images.map((img: any, idx: number) => `
    <div class="flex-shrink-0 w-full snap-center cursor-pointer gallery-image" data-src="${img.imageUrl}" data-index="${idx}">
      <img src="${img.imageUrl}" alt="截图 ${idx + 1}" class="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition" loading="lazy" onerror="this.style.display='none'" />
    </div>
  `).join('')

  return `
    <div class="image-gallery-container relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mt-2 mb-2" data-item-id="${id}">
      <button class="close-gallery absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">手机截图（左右滑动查看）</p>
      <div class="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        ${imagesHtml}
      </div>
    </div>
  `
}

function handleMenuSelect(id: string) {
  setActive(id)
  loadContent(id)
}

watch(() => drawerRef.value?.activeId, (newId) => {
  if (newId && activeId.value !== newId) {
    setActive(newId)
    loadContent(newId)
  }
}, { immediate: true })

function handleKey(e: KeyboardEvent) {
  if (!previewRef.value?.previewState?.visible) return
  switch (e.key) {
    case 'ArrowRight': (previewRef.value as any).nextImg(); break
    case 'ArrowLeft': (previewRef.value as any).prevImg(); break
    case 'Escape': (previewRef.value as any).closePreview(); break
  }
}

onMounted(async () => {
  const defaultId = 'phoneadminHeader'
  if (defaultId) {
    setActive(defaultId)
    await loadContent(defaultId)
  }
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
/* 移动端特有样式（若有） */
</style>