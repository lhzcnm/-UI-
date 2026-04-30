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
  <section class="grid gap-5 md:gap-6 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]">
    <!-- 新机报价卡片 -->
    <div @click="openNewQuote"
      class="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-indigo-500/10 dark:hover:shadow-indigo-600/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-transparent dark:from-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <div class="relative p-5 md:p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 text-2xl">
            {{ t('quotation.newDevice.icon') }}
          </div>
          <div>
            <h3 class="text-xl font-bold tracking-tight text-gray-800 dark:text-white">{{ t('quotation.newDevice.title') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ t('quotation.newDevice.description') }}</p>
          </div>
        </div>
        <div
          class="text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-lg">
          →
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
      </div>
    </div>

    <!-- 旧机报价卡片 -->
    <div @click="openOldQuote"
      class="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-emerald-500/10 dark:hover:shadow-emerald-600/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer">
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-50 via-transparent to-transparent dark:from-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <div class="relative p-5 md:p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 text-2xl">
            {{ t('quotation.oldDevice.icon') }}
          </div>
          <div>
            <h3 class="text-xl font-bold tracking-tight text-gray-800 dark:text-white">{{ t('quotation.oldDevice.title') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ t('quotation.oldDevice.description') }}</p>
          </div>
        </div>
        <div
          class="text-emerald-500 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-lg">
          →
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
      </div>
    </div>
  </section>

  <!-- 图片展示弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="dialogVisible" @click="handleOverlayClick"
        class="fixed inset-0 z-50 flex h-screen items-center justify-center  bg-black/70 backdrop-blur-sm transition-all duration-300">
        <Transition name="zoom">
          <div v-if="dialogVisible" @click.stop
            class="w-full h-full flex flex-col bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden">
            <!-- 标题栏 -->
            <div class="p-2 h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <span class="text-xl">{{ currentTitle === t('quotation.newDevice.title') ? t('quotation.newDevice.icon') : t('quotation.oldDevice.icon') }}</span>
                {{ currentTitle }}
              </h3>

              <div class="flex space-x-2">
                <button @click="imgDownload(currentImage, currentTitle)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/70 transition-all duration-200 text-sm font-medium">
                  {{ t('quotation.dialog.download') }}
                </button>

                <button @click="closeDialog"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/70 transition-all duration-200 text-sm font-medium">
                  {{ t('quotation.dialog.close') }}
                </button>
              </div>
            </div>

            <!-- 图片区域 -->
            <div class="relative bg-white p-2 flex-1 overflow-y-auto dark:bg-black">
              <img :src="currentImage" :alt="currentTitle" class=" mx-auto object-contain "
                @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />

              <div v-if="!currentImage" class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">{{ t('quotation.dialog.noImage') }}</span>
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
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>