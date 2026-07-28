<script setup lang="ts">
import SearchPlane from './SearchPlane.vue'
import QuotationUpload from './quotation/QuotationUpload.vue'

import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'
import OssPlane from './oss/OssPlane.vue'

interface HeaderProps {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

defineProps<HeaderProps>()

const iStore = useSystemStore()
const visibleSearch = ref(false)

const mode = import.meta.env.VITE_APP_MODE

const foldIcon = computed(() => {
  if (iStore.showSidebar) return 'lucide:panel-left-close'
  else return 'lucide:panel-left-open'
})

const style = tv({
  slots: {
    root: [
      'flex justify-between items-center',
      'w-full px-1 h-header border-b',
    ],
    iconBtn: [
      'x-tooltip p-2 rounded-full hover:bg-muted',
      'text-muted-foreground transition-transform'
    ]
  },
})

const b = style()

function goToInstruction() {
  window.open('http://docx.3unlocked.com/admin', '_blank')
}
</script>

<template>
  <div :class="b.root()">
    <div class="flex items-center space-x-2">
      <button :class="b.iconBtn()" accesskey="b" @click="iStore.toggleSidebar">
        <Icon :icon="foldIcon" class="size-5" />
        <div class="x-tooltip-text top120">
          {{ iStore.showSidebar ? '折叠' : '展开' }}
        </div>
      </button>

      <Breadcrumb :items="iStore.breadcrumbItems" />
    </div>

    <div class="flex items-center space-x-2">
      <button @click="goToInstruction"
        class="flex items-center space-x-1 py-1 px-3   hover:text-red-500 dark:hover:text-red-500  text-gray-600 dark:text-gray-50  select-none">
        <Icon icon="tdesign:error-circle" class="size-4" />
        <span class="text-md">使用说明</span>
      </button>

      <button
        class="flex items-center text-muted-foreground gap-2 hover:text-success"
        @click="iStore.showQuotation = true"
      >
        <Icon icon="lucide:upload" class="size-4" />
        <span>上传报价单</span>
      </button>

      <button :class="b.iconBtn()" accesskey="k" @click="visibleSearch = true">
        <Icon icon="lucide:search" class="size-5" />
        <div class="x-tooltip-text top120">搜索</div>
      </button>

      <TodoMsg :ui-btn="b.iconBtn()" />

      <hr class="h-6 w-px bg-border" />
      <TheTheme ghost />

      <button :class="b.iconBtn()" @click="toggleFullscreen">
        <Icon :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" class="size-5" />
        <div class="x-tooltip-text top120">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </div>
      </button>

      <hr class="h-6 w-px bg-border" />

      <button :class="b.iconBtn()" v-if="mode === 'SanHe'"  @click="iStore.showOss = true">
        <Icon icon="lucide:cloud-upload" class="size-5" />
        <div class="x-tooltip-text top120">更新桌面端程序</div>
      </button>

      <button :class="b.iconBtn()" accesskey="s" @click="iStore.showSetting = true">
        <Icon icon="lucide:settings" class="size-5" />
        <div class="x-tooltip-text top120">设置</div>
      </button>
    </div>

    <SearchPlane v-model="visibleSearch" />
    <SettingPlane />
    <OssPlane v-if="mode === 'SanHe'" />
    <QuotationUpload />
  </div>
</template>
