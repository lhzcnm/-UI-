<script setup lang="ts">
import type { ConfirmOptions } from '@3un/shared/confirm'
import { registerConfirm } from '@3un/shared/confirm'
import { isString } from '@3un/ui'

const defaultOptions = {
  title: '提示',
  cancelText: '取消',
  confirmText: '确定',
  text: '',
}

const confirmVisible = ref(false)
const confirmOptions = ref(defaultOptions)

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
  confirmOptions.value = { ...defaultOptions, ...options }
  confirmVisible.value = true

  return new Promise<boolean>((resolve) => resolver = resolve)
}

registerConfirm(confirm)
</script>

<template>
  <XDialog
    v-model="confirmVisible"
    :title="confirmOptions.title"
    :text="confirmOptions.text"
    :maskClosable="false"
    :closeBtn="false"
    ui-mask="z-50"
  >
    <template #footer>
      <div class="flex justify-end space-x-2">
        <XButton
          v-show="confirmOptions.cancelText"
          :label="confirmOptions.cancelText"
          variant="soft"
          @click="handleCancel"
        />
        <XButton :label="confirmOptions.confirmText" @click="handleConfirm" />
      </div>
    </template>
  </XDialog>
</template>
