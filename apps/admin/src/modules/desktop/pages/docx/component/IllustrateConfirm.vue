<script setup lang="ts">
import type { ConfirmOptions } from '@3un/utils'
import { register } from 'module';
import type { boolean } from 'zod/v4';
import { registerIllustrateConfirm } from '../utils';

const defaultOptions: ConfirmOptions = {
  title: '富文本预览',
  cancelText: '取消',
  confirmText: '前往编辑',
}

const visible = ref<boolean>(false)
const curOptions = ref<ConfirmOptions>(defaultOptions)

let resolver: ((val: boolean) => void) | null = null

function handleConfirm() {
  visible.value = false
  resolver?.(true)
}

function handleCancel() {
  visible.value = false
  resolver?.(false)
}

function handleClick(html: string) {
  curOptions.value = { ...defaultOptions, text: html }

  visible.value = true

  return new Promise<boolean>((resolve) => resolver = resolve)
}

registerIllustrateConfirm(handleClick)
</script>

<template>
  <XDialog
    v-model="visible"
    :title="curOptions.title"
    :mask-closable="false"
    ui-text="tiptap"
    ui-mask="z-50"
    ui-root="max-h-[calc(100%-3.75rem)] sm:p-0 sm:max-w-xl"
    ui-header="p-4 border-b"
  >
    <template #default>
      <div class="px-4" v-html="curOptions.text"></div>
    </template>

    <template #footer>
      <div class="px-4 pb-2 mt-4 flex justify-end space-x-2">
        <XButton
          v-show="curOptions.cancelText"
          :label="curOptions.cancelText"
          variant="soft"
          @click="handleCancel"
        />
        <XButton
          :label="curOptions.confirmText"
          @click="handleConfirm"
        />
      </div>
    </template>
  </XDialog>
</template>
