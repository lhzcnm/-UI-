<script setup lang="ts">
import { ACTIVITY_RECHARGE_STORE } from '../utils'
import ActivityRechargeSearchForm from './ActivityRechargeSearchForm.vue'

const store = inject(ACTIVITY_RECHARGE_STORE)!

function handleCancel() {
  store.visibleSearch = false
}
function handleSubmit() {
  handleCancel()
  store.refresh = !store.refresh
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" draggable title="充值筛选">
    <template #default>
      <ActivityRechargeSearchForm v-model="store.formSearch" />
    </template>
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="handleCancel">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>
