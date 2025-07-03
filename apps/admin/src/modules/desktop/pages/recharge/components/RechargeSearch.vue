<script setup lang="ts">
import RechargeSearchForm from './RechargeSearchForm.vue'
import { useCopy } from '@3un/utils'
import { RECHARGE_STORE } from '../utils'

const store = inject(RECHARGE_STORE)!
const cloned = useCopy(store.formSearch)
const copied = ref(cloned())

function handleSubmit() {
  store.formSearch = copied.value
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}

function handleCancel() {
  copied.value = cloned()
  store.visibleSearch = false
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" title="搜索充值">
    <RechargeSearchForm v-model="copied" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="handleCancel">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>
