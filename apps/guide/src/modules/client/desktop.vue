<template>
  <div class="flex h-screen font-sans text-gray-700 select-none">
    <Sidebar ref="sidebarRef" />

    <main ref="contentContainer" class="flex-1 overflow-auto">
      <template v-if="contentList.length">
        <div class="text-2xl font-bold text-black/80 text-center border-b border-dashed border-gray-300 py-4
            sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
          {{ getMenuNameById(activeId) }}
        </div>
        <ContentRenderer
          ref="contentRendererRef"
          :content-list="contentList"
          @preview="openPreview"
          @link-click="handleLinkClick"
        />
      </template>
      <div v-else class="text-center text-2xl text-gray-400 py-10">
        请从左侧菜单选择一个功能
      </div>
    </main>

    <ImagePreview ref="previewRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Sidebar from '../common/components/clientSidebar.vue'
import ContentRenderer from '../common/components/ContentRenderer.vue'
import ImagePreview from '../common/components/ImagePreview.vue'
import { useMenu } from '../common/composables/useMenu.js'
import { useContent } from '../common/composables/useContent.js'
import { useScrollSync } from '../common/composables/useScrollSync.js'
import { menusClientDesktop } from '@/utils/menu'
import '../common/styles/doc-content.css'

const sidebarRef = ref<InstanceType<typeof Sidebar>>()
const contentRendererRef = ref<InstanceType<typeof ContentRenderer>>()
const previewRef = ref<InstanceType<typeof ImagePreview>>()
const contentContainer = ref<HTMLElement | null>(null)

const { activeId, getMenuNameById, setActive } = useMenu(menusClientDesktop)
const { contentList, loading, loadContent } = useContent()

function openPreview(images: string[], index: number) {
  previewRef.value?.openPreview(images, index)
}

function handleLinkClick(payload: { id: string; linkElement: HTMLElement }) {
  const item = contentList.value.find(item => item.value === payload.id)
  if (item?.images?.length) {
    const imageUrls = item.images.map(img => img.imageUrl)
    openPreview(imageUrls, 0)
  } else {
    alert('该服务暂无图片预览')
  }
}

// 滚动联动
const { bindScroll, unbindScroll } = useScrollSync(
  contentContainer,
  contentList,
  activeId,
  setActive,
  (id: string) => {
    for (const menu of menusClientDesktop) {
      if (menu.value === id) return menu.value
      if (menu.children) {
        const child = menu.children.find(c => c.value === id)
        if (child) return child.value!
      }
    }
    for (const menu of menusClientDesktop) {
      if (menu.value && id.startsWith(menu.value)) return menu.value
      if (menu.children) {
        for (const child of menu.children) {
          if (child.value && id.startsWith(child.value)) return child.value
        }
      }
    }
    return id
  }
)

// 监听侧边栏激活变化，加载内容
watch(() => sidebarRef.value?.activeId, (newId) => {
  if (newId) loadContent(newId)
}, { immediate: true })

// ===== 修复：内容变化后重置滚动到顶部 =====
watch(contentList, async () => {
  await nextTick()
  if (contentContainer.value) {
    contentContainer.value.scrollTop = 0
  }
}, { flush: 'post' })

// 键盘事件（预览时支持左右键和 ESC）
function handleKey(e: KeyboardEvent) {
  if (!previewRef.value?.previewState?.visible) return
  switch (e.key) {
    case 'ArrowRight': (previewRef.value as any).nextImg(); break
    case 'ArrowLeft': (previewRef.value as any).prevImg(); break
    case 'Escape': (previewRef.value as any).closePreview(); break
  }
}

onMounted(async () => {
  const defaultId = 'desktopclienthome'
  if (defaultId) {
    setActive(defaultId)
    await loadContent(defaultId)
    // 初次加载也重置滚动
    await nextTick()
    if (contentContainer.value) {
      contentContainer.value.scrollTop = 0
    }
  }
  bindScroll()
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  unbindScroll()
  window.removeEventListener('keydown', handleKey)
})
</script>