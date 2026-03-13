<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { MenuItem, menus } from '../../utils/menu'
import { api } from '@/utils/api'

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

const active = ref('')
const mobileMenu = ref(false)
const openMenus = ref<string[]>([])
const searchKeyword = ref('')
const contentList = ref<ContentItem[]>([])
const contentRef = ref<HTMLElement | null>(null)

const previewState = ref<PreviewState>({
  visible: false,
  currentImg: '',
  images: [],
  currentIndex: 0
})

let scrollFrame: number | null = null

// 获取菜单名称
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

// API 请求
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

// 滚动到指定菜单
async function scrollToMenu(value?: string): Promise<void> {

  if (!value || !contentRef.value) return

  await nextTick()

  const el = document.getElementById(value)

  if (!el) return

  contentRef.value.scrollTo({
    top: el.offsetTop - 10,
    behavior: 'smooth'
  })

}

// 一级菜单点击
async function clickMenu(group: MenuItem): Promise<void> {

  const isOpen = openMenus.value.includes(group.name)

  if (group.children) {

    if (isOpen) {

      openMenus.value = []

      return

    }

    openMenus.value = [group.name]

    const data = await fetchGroupContent(group)

    contentList.value = data

    if (data.length) {

      active.value = data[0].value

      await scrollToMenu(active.value)

    }

  } else if (group.value) {

    openMenus.value = []

    active.value = group.value

    const data = await fetchGroupContent(group)

    contentList.value = data

    await scrollToMenu(group.value)

  }

}

// 二级菜单点击
async function selectMenu(value?: string): Promise<void> {

  if (!value) return

  active.value = value

  await scrollToMenu(value)

}

// 搜索
const filteredMenus = computed<MenuItem[]>(() => {

  if (!searchKeyword.value.trim()) return menus

  const keyword = searchKeyword.value.toLowerCase()

  return menus
    .map(menu => {

      if (menu.children) {

        if (menu.name.toLowerCase().includes(keyword)) return menu

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

watch(searchKeyword, () => {

  openMenus.value = []

  active.value = ''

  contentList.value = []

})

//
// 微信稳定滚动联动算法
//
function updateActiveMenuOnScroll(): void {

  if (!contentRef.value) return

  const scrollTop = contentRef.value.scrollTop

  const sections = contentList.value.map(item => ({
    id: item.value,
    element: document.getElementById(item.value)
  }))

  let current = sections[0]?.id

  for (let i = 0; i < sections.length; i++) {

    const el = sections[i].element

    if (!el) continue

    const offsetTop = el.offsetTop - 20

    if (scrollTop >= offsetTop) {

      current = sections[i].id

    }

  }

  if (current && active.value !== current) {

    active.value = current

    expandParentMenu(current)

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

function prevImg() {

  const { images, currentIndex } = previewState.value

  const index = (currentIndex - 1 + images.length) % images.length

  previewState.value.currentIndex = index

  previewState.value.currentImg = images[index]

}

function nextImg() {

  const { images, currentIndex } = previewState.value

  const index = (currentIndex + 1) % images.length

  previewState.value.currentIndex = index

  previewState.value.currentImg = images[index]

}

function closePreview() {

  previewState.value.visible = false

}

// 初始化
async function initializeFirstMenu(): Promise<void> {

  const first = menus[0]

  if (first.children) {

    openMenus.value = [first.name]

    const data = await fetchGroupContent(first)

    contentList.value = data

    if (data.length) {

      active.value = data[0].value

    }

  } else if (first.value) {

    active.value = first.value

    const data = await fetchGroupContent(first)

    contentList.value = data

  }

}

// 生命周期
onMounted(async () => {

  await initializeFirstMenu()

  if (contentRef.value) {

    contentRef.value.addEventListener('scroll', () => {

      if (scrollFrame) cancelAnimationFrame(scrollFrame)

      scrollFrame = requestAnimationFrame(updateActiveMenuOnScroll)

    })

  }

})

onUnmounted(() => {

  if (scrollFrame) cancelAnimationFrame(scrollFrame)

})

watch(contentList, async () => {

  await nextTick()

  updateActiveMenuOnScroll()

})
</script>

<template>
  <div class="flex h-screen font-sans text-gray-700 select-none">

    <!-- 手机顶部栏 -->
    <div class="fixed top-0 left-0 right-0 h-12 bg-white border-b flex justify-between w-full items-center px-3 z-40">
      <div class="text-xl flex"> 
        <img src="../../../public/favicon.png" alt="logo" class="w-6 h-6 mr-2">
        <div class="font-semibold">使用说明</div>
      </div>
      <button @click="mobileMenu = true" class="text-xl">☰</button>
    </div>

    <!-- 手机菜单遮罩 -->
    <div v-if="mobileMenu" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="mobileMenu = false"></div>

    <!-- 左侧菜单 -->
    <aside
      class="flex flex-col w-64 p-4 border-r h-screen bg-white md:static fixed top-0 left-0 z-50 transform transition-transform"
      :class="mobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">

      <!-- 标题 -->
      <div class="flex flex-col items-center mb-6">
        <div class="text-xl font-bold text-gray-600">使用说明</div>
        <div class="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full mt-1"></div>
      </div>

      <!-- 搜索 -->
      <div class="relative mb-3">
        <input v-model="searchKeyword" placeholder="关键字搜索..."
          class="w-full pl-10 pr-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <span v-if="searchKeyword !== ''" @click="searchKeyword = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon icon="uil:trash-alt" class="size-5"/>
        </span>
      </div>

      <!-- 菜单 -->
      <div class="flex-1 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        <div v-for="group in filteredMenus" :key="group.name" class="mb-3">

          <!-- 一级菜单 -->
          <div class="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
            @click="clickMenu(group); mobileMenu = false" :class="[
              active === group.value
                ? 'text-gray-600 bg-gray-50 font-semibold shadow-inner'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]">
            <span>{{ group.name }}</span>

            <span v-if="group.children" class="text-xs" :class="openMenus.includes(group.name) ? 'rotate-90' : ''">
              <Icon icon="ci:chevron-right" />
            </span>
          </div>

          <!-- 二级菜单 -->
          <div v-if="group.children && openMenus.includes(group.name)"
            class="ml-4 mt-1 border-l border-gray-200 pl-3 space-y-1">

            <div v-for="item in group.children" :key="item.value" @click="selectMenu(item.value); mobileMenu = false"
              class="relative px-2 py-2 text-sm rounded-lg cursor-pointer" :class="[
                active === item.value
                  ? 'bg-gray-50 text-gray-600 font-medium shadow-inner'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              ]">
              {{ item.name }}
            </div>

          </div>

        </div>

      </div>

    </aside>


    <!-- 右侧内容 -->
    <main ref="contentRef" @click="handleContentClick" class="flex-1 overflow-auto pt-12 md:pt-0 content-scroll">

      <template v-if="contentList.length">

        <div v-for="item in contentList" :key="item.value" :id="item.value" class="bg-white w-full pt-4">

          <div
            class="text-xl md:text-2xl font-bold text-black/80 text-center border-b border-dashed border-gray-300 pb-4">
            {{ getMenuNameByValue(item.value) }} - 使用说明
          </div>

          <div
            class="text-gray-700 leading-relaxed [&_img]:max-w-full [&_img]:rounded-lg [&_img]:cursor-zoom-in [&_img]:my-4 px-4 md:px-6 border-b"
            v-html="item.content"></div>

        </div>

      </template>

      <div v-else class="text-center text-xl text-gray-400 py-10">
        暂无内容(请点击菜单)
      </div>

    </main>


    <!-- 图片预览 -->
    <div v-if="previewState.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">

      <img :src="previewState.currentImg" class="max-h-[85vh] max-w-[95vw] object-contain" />

      <!-- 上一张 -->
      <div @click="prevImg" class="absolute left-3 md:left-10 text-white text-4xl cursor-pointer">
        ‹
      </div>

      <!-- 下一张 -->
      <div @click="nextImg" class="absolute right-3 md:right-10 text-white text-4xl cursor-pointer">
        ›
      </div>

      <!-- 关闭 -->
      <div @click="closePreview" class="absolute top-5 right-5 text-white text-xl cursor-pointer">
        ✕
      </div>

    </div>

  </div>
</template>

<style>
.content-scroll {
  -webkit-overflow-scrolling: touch;
}
</style>