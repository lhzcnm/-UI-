<script setup lang="ts">
import LogSearchForm from './LogSearchForm.vue'
import { IP_REG, useCopyFn } from '@3un/utils'
import { LOG_STORE } from '../utils'
import { toast } from 'vue-sonner'

const store = inject(LOG_STORE)!
const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

function handleSubmit() {
  const { ip } = copied.value
  if (ip && !IP_REG.test(ip)) {
    return toast.warning("请输入正确的ipv4地址")
  }
  
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
  <XDialog v-model="store.visibleSearch" draggable title="搜索用户">
    <LogSearchForm v-model="copied" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="handleCancel">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>
