<script setup lang="ts">
import { updateSetting } from '@/api/settings'
import { toast } from 'vue-sonner'

interface TheProps {
  type: string
}

const props = defineProps<TheProps>()
const open = defineModel<boolean>({ required: true })
const text = defineModel<string>('text', { required: true })

const iStore = useSystemStore()

async function handleSubmit() {
  await updateSetting([
    { name: props.type, content: text.value },
  ])

  iStore.showSetting = !iStore.showSetting
  open.value = false

  toast.success('保存成功')
}
</script>

<template>
  <TheModal v-model="open" title="公告编辑">
    <div class="px-4">
      <XTextarea
        v-model="text"
        placeholder="请输入公告内容"
        rows="15"
      />
    </div>
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="open = false">取消</XButton>
      <XButton @click="handleSubmit">保存</XButton>
    </div>
  </TheModal>
</template>
