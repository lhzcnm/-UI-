<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { serviceApi } from '@/api/services'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 图片数据
const oldImage = ref<string>('')
const newImage = ref<string>('')

// 弹窗状态
const dialogVisible = ref<boolean>(false)
const currentImage = ref<string>('')
const currentTitle = ref<string>('')

// 获取报价图片
async function getQuoteImg(): Promise<void> {
  try {
    const res = await serviceApi.getQuoteImage()
    oldImage.value = res.data.oldQuotation
    newImage.value = res.data.newQuotation
  } catch (error) {
    console.error(t('quotation.error.getImage'), error)
  }
}

// 打开新机报价弹窗
function openNewQuote(): void {
  currentImage.value = newImage.value
  currentTitle.value = t('quotation.newDevice.title')
  dialogVisible.value = true
}

// 打开旧机报价弹窗
function openOldQuote(): void {
  currentImage.value = oldImage.value
  currentTitle.value = t('quotation.oldDevice.title')
  dialogVisible.value = true
}

// 关闭弹窗
function closeDialog(): void {
  dialogVisible.value = false
  currentImage.value = ''
  currentTitle.value = ''
}

// 点击遮罩关闭
function handleOverlayClick(e: MouseEvent): void {
  if (e.target === e.currentTarget) {
    closeDialog()
  }
}

// 下载图片
async function imgDownload(url: string, fileName: string) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = fileName

    document.body.appendChild(link)

    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
    toast.success(t('quotation.toast.downloadSuccess'))

  } catch (e) {
    toast.error(t('quotation.toast.downloadFailed'))
  }
}

onMounted(() => {
  getQuoteImg()
})
</script>

<template>
  <section class="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(300px,_1fr))]">
    <!-- 新机报价卡片（华为风格：极简白，华为红悬浮强调） -->
    <div @click="openNewQuote"
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_-8px_rgba(199,0,11,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      
      <div class="relative p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 图标容器：华为红微背景 -->
          <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
            {{ t('quotation.newDevice.icon') }}
          </div>
          <div>
            <h3 class="text-lg font-bold tracking-tight text-slate-800 group-hover:text-[#C7000B] transition-colors duration-300">
              {{ t('quotation.newDevice.title') }}
            </h3>
            <p class="text-sm text-slate-500 mt-1">{{ t('quotation.newDevice.description') }}</p>
          </div>
        </div>
        <!-- 箭头指示器 -->
        <div class="text-[#C7000B] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-lg font-bold">
          →
        </div>
      </div>
    </div>

    <!-- 旧机报价卡片 -->
    <div @click="openOldQuote"
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_-8px_rgba(199,0,11,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      
      <div class="relative p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
            {{ t('quotation.oldDevice.icon') }}
          </div>
          <div>
            <h3 class="text-lg font-bold tracking-tight text-slate-800 group-hover:text-[#C7000B] transition-colors duration-300">
              {{ t('quotation.oldDevice.title') }}
            </h3>
            <p class="text-sm text-slate-500 mt-1">{{ t('quotation.oldDevice.description') }}</p>
          </div>
        </div>
        <div class="text-[#C7000B] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-lg font-bold">
          →
        </div>
      </div>
    </div>
  </section>

  <!-- 图片展示弹窗（华为风格：高级暗黑遮罩，干净清爽） -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="dialogVisible" @click="handleOverlayClick"
        class="fixed inset-0 z-50 flex h-screen items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
        <Transition name="zoom">
          <div v-if="dialogVisible" @click.stop
            class="w-full h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 my-4 lg:mx-auto lg:my-auto lg:max-w-5xl">
            <!-- 标题栏：极简线条分隔 -->
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                {{ currentTitle }}
              </h3>

              <div class="flex space-x-3">
                <button @click="imgDownload(currentImage, currentTitle)"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C7000B] text-white hover:bg-[#a30009] transition-all duration-200 text-sm font-medium shadow-sm">
                  {{ t('quotation.dialog.download') }}
                </button>

                <button @click="closeDialog"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 text-sm font-medium">
                  {{ t('quotation.dialog.close') }}
                </button>
              </div>
            </div>

            <!-- 图片区域 -->
            <div class="relative bg-slate-50 flex-1 overflow-y-auto flex items-center justify-center p-6">
              <img :src="currentImage" :alt="currentTitle" class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />

              <div v-if="!currentImage" class="flex flex-col items-center justify-center text-slate-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium">{{ t('quotation.dialog.noImage') }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}
</style>