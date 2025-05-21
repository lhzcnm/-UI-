<script setup lang="ts">
import { Toaster } from 'vue-sonner'

import type { Theme } from '@3un/shared/theme'
import type { ConfirmOptions } from '@3un/shared/confirm'
import { registerConfirm } from '@3un/shared/confirm'
import { THEME } from '@3un/shared/theme'
import { isString } from '@3un/ui'

const html = document.documentElement
const isDark = html.classList.contains('dark')
const theme = ref<Theme>({
  name: isDark ? 'dark' : 'light',
  isDark: isDark,
})

provide(THEME, theme)

const confirmVisible = ref(false)
const confirmOptions = ref({
  title: '提示',
  cancelText: '取消',
  confirmText: '确定',
  text: '',
})

let resolver: ((value: boolean) => void) | null = null

function handleConfirm() {
  confirmVisible.value = false
  resolver?.(true)
}

function handleCancel() {
  confirmVisible.value = false
  resolver?.(false)
}

function confirm(options: string | ConfirmOptions) {
  if (isString(options)) options = { text: options }
  confirmOptions.value = {
    ...confirmOptions.value,
    ...options
  }

  confirmVisible.value = true
  return new Promise<boolean>((resolve) => resolver = resolve)
}

registerConfirm(confirm)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </template>
  </RouterView>

  <XDialog
    v-model="confirmVisible"
    :title="confirmOptions.title"
    :text="confirmOptions.text"
    :maskClosable="false"
    :closeBtn="false"
  >
    <template #footer>
      <div class="flex justify-end space-x-2">
        <XButton variant="soft" :label="confirmOptions.cancelText" @click="handleCancel" />
        <XButton :label="confirmOptions.confirmText" @click="handleConfirm" />
      </div>
    </template>
  </XDialog>

  <Toaster
    richColors
    position="top-center"
    :theme="theme.name"
  />
</template>
