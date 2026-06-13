<script setup lang="ts">
import type { localListTableTypes } from '@/types/local';
import { useLocalStore } from '../utils/store'
import { localApi } from '@/api/local';
import { toast } from 'vue-sonner';

interface localActionProps {
  row: localListTableTypes
}
const props = defineProps<localActionProps>()

const store = useLocalStore()

function udpate() {
  store.updateForm = { ...props.row }
  store.localDialog.updateDialog = true
}

async function deleteLocal() {
  try {
    await localApi.deletetLocal([props.row.id])
    store.getData()
    toast.success('删除成功')

  } catch (e) { }
}
</script>

<template>
  <div class="flex justify-end items-center space-x-2 border-t p-2">
    <XButton size="sm" variant="outline" @click="udpate">编辑</XButton>
    <XButton size="sm" variant="outline" color="danger" @click="deleteLocal">删除</XButton>
  </div>
</template>