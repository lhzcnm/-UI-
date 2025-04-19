<script setup lang="ts">
import { SERVICE_STORE } from '../utils'
import ItemForm from './ItemForm.vue'

const store = inject(SERVICE_STORE)!
</script>

<template>
  <XDialog
    v-model="store.visableUpdate"
    content-class="sm:max-w-lg"
    :interact="false"
    title="更新服务"
  >
    <div class="max-h-[75vh] overflow-y-auto">
      <ItemForm v-model="store.updateForm" />
    </div>

    <template #footer>
      <div class="flex space-x-2 justify-end mt-3">
        <XButton variant="soft" @click="store.visableUpdate = false">取消</XButton>
        <XButton>保存</XButton>
      </div>
    </template>
  </XDialog>
</template>
