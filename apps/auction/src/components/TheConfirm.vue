<script setup lang="ts">
import { isString } from '@3un/ui'
import { registerConfirm } from '@3un/utils'
import { type ConfirmOptions } from '@3un/utils'
  
const defaultOptions: ConfirmOptions = {
  title: '提示',
  cancelText: '取消',
  confirmText: '确认',
  text: '',
}

const visible = ref<boolean>(false)
const confirmOptions = ref<ConfirmOptions>(defaultOptions)

let resolver: ((value: boolean) => void) | null = null

function confirm(options: string | ConfirmOptions) {
  if (isString(options)) options = { text: options }
  confirmOptions.value = { ...defaultOptions, ...options }
  visible.value = true

  return new Promise<boolean>((resolve) => resolver = resolve)
}

function handleConfirm() {
  visible.value = false
  resolver?.(true)
}

function handleCancel() {
  visible.value = false
  resolver?.(false)
}

registerConfirm(confirm)
</script>

<template>
  <XDialog v-model="visible"
    :title="confirmOptions.title"
    :text="confirmOptions.text"
    :mask-closable="false"
    :close-btn="false" 
    ui-text="tiptap"
    ui-mask="z-50">
    <template #footer>
      <div class="flex justify-end space-x-2">
        <XButton :label="confirmOptions.cancelText"
          variant="soft"
          @click="handleCancel" />
        <XButton :label="confirmOptions.confirmText"
          @click="handleConfirm" />
      </div>
    </template>
  </XDialog>
</template>
