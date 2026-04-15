<script setup lang="ts">
import CreditSearchForm from './CreditSearchForm.vue'
import { useCopyFn } from '@3un/utils'
import { CREDIT_STORE } from '../utils'

const store = inject(CREDIT_STORE)!
const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

function handleSubmit() {
  store.formSearch = {
    ...copied.value,
    userId: !!copied.value.userId ? copied.value.userId : undefined
  }
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
  <TheModal v-model="store.visibleSearch" title="搜索积分记录">
    <CreditSearchForm ref="formRef" v-model="copied" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="handleCancel">取消</XButton>
      <XButton @click="handleSubmit">搜索</XButton>
    </div>
  </TheModal>
</template>
