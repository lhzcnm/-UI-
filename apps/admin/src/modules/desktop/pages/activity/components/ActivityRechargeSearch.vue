<script setup lang="ts">
import { useCopyFn } from '@3un/utils'
import { ACTIVITY_RECHARGE_STORE } from '../utils'
import ActivityRechargeSearchForm from './ActivityRechargeSearchForm.vue'

const store = inject(ACTIVITY_RECHARGE_STORE)!

const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

function handleCancel() {
  copied.value = cloned()
  store.visibleSearch = false
}

function handleSubmit() {
  store.formSearch = copied.value
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" draggable title="充值筛选">
    <template #default>
      <ActivityRechargeSearchForm v-model="copied" />
    </template>
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="handleCancel">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>
