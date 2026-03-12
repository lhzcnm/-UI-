<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { MenuItem, menus } from '../../utils/menu'
import { api } from '@/utils/api'

// 类型定义
interface ContentItem {
  value: string
  content: string
}

interface PreviewState {
  visible: boolean
  currentImg: string
  images: string[]
  currentIndex: number
}

// 状态管理 
const active = ref('')
const openMenus = ref<string[]>([])
const searchKeyword = ref('')
const contentList = ref<ContentItem[]>([])
const contentRef = ref<HTMLElement | null>(null)

// 图片预览状态
const previewState = ref<PreviewState>({
  visible: false,
  currentImg: '',
  images: [],
  currentIndex: 0
})

// 防抖定时器
let scrollTimeout: number | null | any = null

// 工具函数 
function getMenuNameByValue(value: string): string {
  for (const menu of menus) {
    if (menu.value === value) return menu.name
    if (menu.children) {
      const child = menu.children.find(item => item.value === value)
      if (child) return child.name
    }
  }
  return ''
}

// API 调用
async function fetchGroupContent(group: MenuItem): Promise<ContentItem[]> {
  const codes: string[] = []
  
  if (group.children) {
    codes.push(...group.children.map(i => i.value!).filter(Boolean))
  } else if (group.value) {
    codes.push(group.value)
  }

  if (!codes.length) return []

  try {
    const res = await api.getGuide(codes)
    return res?.data?.data?.map((item: any) => ({
      value: item.serviceCode,
      content: item.serviceDesc
    })) || []
  } catch (error) {
    console.error('获取文档失败:', error)
    return []
  }
}

// 菜单交互
async function scrollToMenu(value?: string): Promise<void> {
  if (!value || !contentRef.value) return
  
  await nextTick()
  const el = contentRef.value.querySelector(`#${value}`) as HTMLElement
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function clickMenu(group: MenuItem): Promise<void> {
  const isOpen = openMenus.value.includes(group.name)

  if (group.children) {
    // 一级菜单
    if (isOpen) {
      openMenus.value = []
      return
    }
    
    openMenus.value = [group.name]
    const data = await fetchGroupContent(group)
    contentList.value = data

    if (data.length > 0) {
      active.value = data[0].value
      await scrollToMenu(active.value)
    }
  } else if (group.value) {
    // 二级菜单（直接内容）
    openMenus.value = []
    
    if (active.value !== group.value) {
      active.value = group.value
      const data = await fetchGroupContent(group)
      contentList.value = data
      await scrollToMenu(group.value)
    }
  }
}

async function selectMenu(value?: string): Promise<void> {
  if (!value) return
  active.value = value
  await scrollToMenu(value)
}

// 搜索功能 
const filteredMenus = computed<MenuItem[]>(() => {
  if (!searchKeyword.value.trim()) return menus

  const keyword = searchKeyword.value.trim().toLowerCase()

  return menus
    .map(menu => {
      if (menu.children) {
        // 一级菜单匹配
        if (menu.name.toLowerCase().includes(keyword)) return menu
        
        // 二级菜单匹配
        const children = menu.children.filter(child =>
          child.name.toLowerCase().includes(keyword)
        )
        if (children.length) return { ...menu, children }
      } else if (menu.name.toLowerCase().includes(keyword)) {
        return menu
      }
      return null
    })
    .filter(Boolean) as MenuItem[]
})

// 监听搜索关键字变化
watch(searchKeyword, () => {
  openMenus.value = []
  active.value = ''
  contentList.value = []
})

// 滚动联动
function updateActiveMenuOnScroll(): void {
  if (!contentRef.value || contentList.value.length === 0) return

  const sections = contentList.value
    .map(item => ({
      id: item.value,
      element: document.getElementById(item.value)
    }))
    .filter(section => section.element) // 过滤掉不存在的元素

  if (sections.length === 0) return

  const container = contentRef.value
  const containerRect = container.getBoundingClientRect()
  
  // 找到当前可视区域最靠上的章节
  let currentSection = sections[0].id
  let minDistance = Infinity

  sections.forEach(section => {
    if (!section.element) return
    
    const rect = section.element.getBoundingClientRect()
    const distance = Math.abs(rect.top - containerRect.top)

    // 如果元素在可视区域内或刚刚超出，选择距离最小的
    if (rect.bottom > containerRect.top && rect.top < containerRect.bottom) {
      if (distance < minDistance) {
        minDistance = distance
        currentSection = section.id
      }
    } else if (rect.top <= containerRect.top) {
      // 元素在容器上方，但如果它是最接近顶部的，也考虑
      if (distance < minDistance) {
        minDistance = distance
        currentSection = section.id
      }
    }
  })

  // 更新激活的菜单项
  if (currentSection && active.value !== currentSection) {
    active.value = currentSection

    // 自动展开父菜单
    expandParentMenu(currentSection)
  }
}

function expandParentMenu(value: string): void {
  for (const menu of menus) {
    if (menu.children) {
      const hasChild = menu.children.some(child => child.value === value)
      if (hasChild && !openMenus.value.includes(menu.name)) {
        openMenus.value = [menu.name]
        break
      }
    }
  }
}

// 图片预览 
function handleContentClick(e: MouseEvent): void {
  const target = e.target as HTMLElement
  
  if (target.tagName === 'IMG' && contentRef.value) {
    const imgs = Array.from(contentRef.value.querySelectorAll('img')) as HTMLImageElement[]
    const img = target as HTMLImageElement
    
    previewState.value = {
      visible: true,
      currentImg: img.src,
      images: imgs.map(i => i.src),
      currentIndex: imgs.findIndex(i => i.src === img.src)
    }
  }
}

function prevImg(e?: MouseEvent): void {
  if (e) e.stopPropagation()
  
  const { images, currentIndex } = previewState.value
  if (!images.length) return

  const newIndex = (currentIndex - 1 + images.length) % images.length
  previewState.value = {
    ...previewState.value,
    currentIndex: newIndex,
    currentImg: images[newIndex]
  }
}

function nextImg(e?: MouseEvent): void {
  if (e) e.stopPropagation()
  
  const { images, currentIndex } = previewState.value
  if (!images.length) return

  const newIndex = (currentIndex + 1) % images.length
  previewState.value = {
    ...previewState.value,
    currentIndex: newIndex,
    currentImg: images[newIndex]
  }
}

function closePreview(): void {
  previewState.value = {
    visible: false,
    currentImg: '',
    images: [],
    currentIndex: 0
  }
}

function handleKey(e: KeyboardEvent): void {
  if (!previewState.value.visible) return
  
  switch (e.key) {
    case 'ArrowRight':
      nextImg()
      break
    case 'ArrowLeft':
      prevImg()
      break
    case 'Escape':
      closePreview()
      break
  }
}

// 初始化 
async function initializeFirstMenu(): Promise<void> {
  const first = menus[0]

  if (first.children) {
    openMenus.value = [first.name]
    const data = await fetchGroupContent(first)
    contentList.value = data

    if (data.length > 0) {
      active.value = data[0].value
      await scrollToMenu(active.value)
    }
  } else if (first.value) {
    active.value = first.value
    const data = await fetchGroupContent(first)
    contentList.value = data
    await scrollToMenu(first.value)
  }
}

// 生命周期 
onMounted(async () => {
  await initializeFirstMenu()
  
  // 添加滚动监听
  if (contentRef.value) {
    contentRef.value.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(updateActiveMenuOnScroll, 50)
    })
  }
  
  // 添加键盘监听
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  window.removeEventListener('keydown', handleKey)
})

// 监听内容变化，重新检查激活项
watch(contentList, async () => {
  await nextTick()
  updateActiveMenuOnScroll()
})
</script>

<template>
  <div class="flex h-screen font-sans text-gray-700 select-none">

    <!-- 左侧菜单 -->
    <aside class="flex flex-col w-64 p-4 border-r shadow-sm h-screen bg-white/40">

      <div class="flex flex-col items-center mb-6">
        <div class="text-2xl font-bold text-gray-600">使用说明</div>
        <div class="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full mt-1"></div>
      </div>

      <!-- 搜索 -->
      <div class="relative mb-3">
        <input 
          v-model="searchKeyword" 
          placeholder="关键字搜索..."
          class="w-full pl-10 pr-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm" 
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <!-- 菜单 -->
      <div class="flex-1 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        <div v-if="!filteredMenus.length" class="text-center text-gray-400 py-10">
          暂无内容<br>(请重新输入关键字搜索)
        </div>

        <div v-for="group in filteredMenus" :key="group.name" class="mb-3">

          <div 
            class="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
            :class="[
              active === group.value
                ? 'text-gray-600 bg-gray-50 font-semibold shadow-inner'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]" 
            @click="clickMenu(group)"
          >
            <span>{{ group.name }}</span>

            <span 
              v-if="group.children" 
              class="text-xs"
              :class="openMenus.includes(group.name) ? 'rotate-90' : ''"
            >
              <Icon icon="ci:chevron-right" />
            </span>
          </div>

          <transition name="menu">
            <div 
              v-if="group.children && openMenus.includes(group.name)"
              class="ml-4 mt-1 border-l border-gray-200 pl-3 space-y-1"
            >
              <div 
                v-for="item in group.children" 
                :key="item.value" 
                @click="selectMenu(item.value)"
                class="relative px-2 py-2 text-sm rounded-lg cursor-pointer" 
                :class="[
                  active === item.value
                    ? 'bg-gray-50 text-gray-600 font-medium shadow-inner'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                <span 
                  v-if="active === item.value"
                  class="absolute left-[-12px] top-0 h-full w-1 bg-gray-500 rounded-r"
                ></span>

                {{ item.name }}
              </div>
            </div>
          </transition>

        </div>

      </div>

    </aside>

    <!-- 右侧内容 -->
    <main 
      ref="contentRef" 
      @click="handleContentClick" 
      class="flex-1 p-4 overflow-auto space-y-6"
    >

      <template v-if="contentList.length">

        <div 
          v-for="item in contentList" 
          :key="item.value" 
          :id="item.value"
          class="bg-white/20 w-2/3 mx-auto rounded-lg p-6 shadow-md border border-gray-300/20"
        >
          <div class="text-2xl font-bold text-black/80 text-center border-b-2 border-gray-300 pb-2 mb-4">
            {{ getMenuNameByValue(item.value) }} - 使用说明
          </div>

          <div
            class="text-gray-700 leading-relaxed [&_img]:max-w-full [&_img]:rounded-lg [&_img]:cursor-zoom-in [&_img]:my-4"
            v-html="item.content"
          ></div>

        </div>

      </template>

      <div v-else class="text-center text-2xl text-gray-400 py-10">
        暂无内容(请点击左侧菜单获取文档)
      </div>

    </main>

    <!-- 图片预览 -->
    <div 
      v-if="previewState.visible" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <!-- 上一张 -->
      <div 
        @click="prevImg"
        class="absolute left-10 text-white text-5xl cursor-pointer select-none hover:text-sky-400 px-4 "
      >
        ‹
      </div>

      <img 
        :src="previewState.currentImg" 
        class="h-[80vh] w-[80vw] object-contain rounded-lg" 
      />

      <!-- 下一张 -->
      <div 
        @click="nextImg"
        class="absolute right-10 text-white text-5xl cursor-pointer select-none hover:text-sky-400 px-4 "
      >
        ›
      </div>

      <div 
        @click="closePreview"
        class="absolute bottom-10 text-center rounded-md w-24 p-2 text-gray-300 hover:text-red-400 bg-gray-300/20 hover:bg-red-500/20 cursor-pointer"
      >
        关闭
      </div>

    </div>

  </div>
</template>
