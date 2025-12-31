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
  <TheModal
    v-model="store.visibleSearch"
    title="筛选"
    class="flex flex-col"
    header-class="border-b"
  >
    <template #default>
      <div class="p-4 flex flex-col space-y-4 overflow-auto">
        <ActivityRechargeSearchForm class="flex-1 border-b pb-4 overflow-y-auto overflow-x-hidden" v-model="store.formSearch" />
        <div class="flex justify-end gap-2">
          <XButton variant="soft" label="取消" @click="store.visibleSearch = false" />
          <XButton label="提交" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </TheModal>
</template>
