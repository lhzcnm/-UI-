<script setup lang="ts">
import { localApi } from '@/api/local';
import { createLocalForm, useLocalStore } from '../utils/store'
import { toast } from 'vue-sonner';
import FormBase from './FormBase.vue';

const store = useLocalStore()

function validateForm() {
  const { module, messageKey, ch, en } = store.createForm

  if (module == -1) {
    toast.warning('请选择模块')
    return false
  }
  if (!messageKey) {
    toast.warning('请输入messageKey')
    return false
  }
  if (!ch) {
    toast.warning('请输入中文名')
    return false
  }
  if (!en) {
    toast.warning('请输入英文名')
    return false
  }
  return true
}

async function createLocal() {
  try {
    if (!validateForm()) { return }

    const params = store.createForm
    const res = await localApi.postLocal(params)
    store.getData()
    toast.success(res.data)
    store.localDialog.createDialog = false
    clearForm()
  } catch (e) {

  }
}

function clearForm() {
  if (store.query == '-1') {
    store.createForm = { ...createLocalForm }
  } else {
    store.createForm = {
      ...createLocalForm,
      module: Number(store.query)
    }
  }
}


</script>

<template>
  <XDialog v-model="store.localDialog.createDialog" ui-root="p-0 sm:p-0 sm:max-w-[450px]"
    ui-header="pt-4 px-4 dark:text-gray-400" title="新增前台中英文" draggable>

    <FormBase v-model="store.createForm" />
    <div class="flex justify-end gap-3 mt-auto border-t px-4 select-none">
      <div class="py-4 ml-auto space-x-2">
        <XButton variant="soft" @click="store.localDialog.createDialog = false">取消</XButton>
        <XButton @click="createLocal">新增</XButton>
      </div>
    </div>
  </XDialog>
</template>