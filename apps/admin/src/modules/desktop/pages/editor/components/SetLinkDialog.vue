<script setup lang="ts">
import type { ConfirmOptions } from '@3un/utils'
import { registerSetLinkConfirm } from '../utils/setLinkConfirm'

const defaultOptions: ConfirmOptions = {
  title: '设置超链接',
  cancelText: '取消',
  confirmText: '确定',
  uiRoot: 'sm:max-w-sm'
}

const dialogVisible = ref<boolean>(false)
const dialogOptions = ref(defaultOptions)

const linkVal = ref<string>('')

let resolver: ((value: string) => void) | null = null
// let rejecter: ((value: boolean) => void) | null = null

function handleConfirm() {
  dialogVisible.value = false
  resolver?.(linkVal.value)
}

function handleCancel() {
  dialogVisible.value = false
  resolver?.('')
}

function handleClick(options: ConfirmOptions) {
  dialogOptions.value = { ...defaultOptions, ...options }

  linkVal.value = ''
  dialogVisible.value = true

  return new Promise<string>((resolve) => resolver = resolve)
}

registerSetLinkConfirm(handleClick)
</script>

<template>
  <XDialog
    v-model="dialogVisible"
    :title="dialogOptions.title"
    :mask-closable="false"
    ui-text="tiptap"
    ui-mask="z-50"
    :ui-root="dialogOptions.uiRoot"
  >
    <template #default>
      <XInput placeholder="请输入超链接地址" v-model="linkVal" />
    </template>

    <template #footer>
      <div class="mt-4 flex justify-end space-x-2">
        <XButton
          v-show="dialogOptions.cancelText"
          :label="dialogOptions.cancelText"
          variant="soft"
          @click="handleCancel"
        />
        <XButton
          :label="dialogOptions.confirmText"
          @click="handleConfirm"
        />
      </div>
    </template>
  </XDialog>
</template>
