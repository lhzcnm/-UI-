<script setup lang="ts">
import PriceUpdateForm from './forms/PriceUpdateForm.vue'

import { HOME_STORE } from '../utils'

interface BatchUpdateDialogEmits {
  confirm: []
}

const store = inject(HOME_STORE)!
const emits = defineEmits<BatchUpdateDialogEmits>()
</script>

<template>
  <XDialog
    v-model="store.visibleBatchUpdatePrice"
    title="批量修改价格"
    draggable
    ui-root="sm:p-0 sm:max-w-lg"
    ui-header="p-4 border-b">
    <template #default>
      <PriceUpdateForm class="p-4 border-b" v-model="store.formBatchUpdate" />
    </template>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="px-4 text-xs">修改后价格若小于 0 则不修改该数据</span>
        <div class="flex justify-end items-center p-4 space-x-2">
          <XButton label="取消" variant="soft" @click="store.visibleBatchUpdatePrice = false" />
          <XButton label="保存" @click="emits('confirm')" />
        </div>
      </div>
    </template>
  </XDialog>
</template>
