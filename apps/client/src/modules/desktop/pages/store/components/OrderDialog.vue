<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { MARKET_STORE } from '../utils/symbol'

interface OrderDialogEmits {
  confirm: [],
}

const store = inject(MARKET_STORE)!

const emits = defineEmits<OrderDialogEmits>()

function handleClose() {
  store.visibleOrder = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleOrder"
    :closeOnEsc="false" :mask-closable="false"
    draggable
    title="下单确认" :close-btn="false" ui-root="sm:max-w-lg"
  >
    <template #default>
      <BaseForm v-model="store.createOrder"
        :service="store.selectService" />
    </template>

    <template #footer>
      <div class="mt-2 flex space-x-2 justify-end">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="handleClose" @confirm="emits('confirm')"
        />
      </div>
    </template>
  </XDialog>
</template>
