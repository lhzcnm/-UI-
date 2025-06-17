<script setup lang="ts">
import { getPrintPayload, STORE } from '../utils'
import { wsFetch } from '../utils/websocket'

const store = inject(STORE)!
const loading = ref(false)
const selected = ref(1)

interface Template {
  id: number
  preview: string
  tags: string[]
}

const baseTag = ['设备名称', '颜色', 'IMEI', '主板序号', '版本', '型号', '容量', '电池循环次数']
const templates: Template[] = [
  {
    id: 1,
    tags: baseTag,
    preview: '/images/tmp-1.png'
  },
  {
    id: 2,
    tags: [...baseTag, '网络锁', '激活锁', '保修期限'],
    preview: '/images/tmp-2.png'
  },
  {
    id: 3,
    tags: [...baseTag, '序列号',  '网络锁', '激活锁', '保修期限'],
    preview: '/images/tmp-3.png'
  },
]

async function handleSubmit() {
  loading.value = true

  const device = store.deviceMap.get(store.printIndex)
  const response = await wsFetch<string>({
    ...getPrintPayload(device!),
    TemplateId: selected.value,
    type: 'print',
  })

  const binaryString = atob(response)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  const blob = new Blob([bytes], { type: 'application/pdf' })
  window.open(URL.createObjectURL(blob), '_blank')
  loading.value = false
}
</script>

<template>
  <XDialog
    v-model="store.visiblePrint"
    ui-root="sm:max-w-2xl"
    title="选择标签模板"
  >
    <div class="h-[450px] overflow-y-auto">
      <div class="grid grid-cols-2 gap-3">
        <label 
          v-for="template in templates" :key="template.id" 
          class="bg-card border rounded cursor-pointer"
        >
          <div class="flex items-center px-3 h-10 space-x-2">
            <input v-model="selected" type="radio" :value="template.id" name="template" class="size-4" />
            <div class="font-semibold">模板 {{ template.id }}</div>
          </div>

          <div class="p-3 pt-0 h-64">
            <img :src="template.preview" alt="Preview" draggable="false" class="size-full border rounded">
          </div>

          <div class="flex items-center flex-wrap gap-1 p-3 border-t border-dashed">
            <XTag v-for="tag in template.tags" :key="tag" size="sm" :label="tag" />
          </div>
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" label="取消" @click="store.visiblePrint = false" />
        <XButton :loading :disabled="selected === null" label="打印" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>
