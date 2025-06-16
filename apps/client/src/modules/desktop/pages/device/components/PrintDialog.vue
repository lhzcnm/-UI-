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

const templates: Template[] = [
  {
    id: 1,
    tags: ['设备名称', '颜色', 'IMEI', '主板序号', '版本', '型号', '容量', '电池循环次数'],
    preview: '/images/tmp-1.png'
  },
  {
    id: 2,
    tags: ['设备名称', '颜色', 'IMEI', '主板序号', '版本', '型号', '容量', '电池循环次数', '网络锁', '激活锁', '保修期限'],
    preview: '/images/tmp-2.png'
  },
]

async function handleSubmit() {
  loading.value = true

  let device = null
  for (const [key, value] of store.deviceMap) {
    const [DeviceID, _] = key.split(':')
    if (DeviceID === store.printIndex) {
      device = value
      break
    }
  }

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

function handleSelectTemplate(index: number) {
  selected.value = index
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
        <div 
          v-for="template in templates" :key="template.id" 
          class="space-y-2 p-3 border rounded cursor-pointer"
          @click="handleSelectTemplate(template.id)"
        >
          <div class="flex items-center space-x-2">
            <div 
              class="size-4 rounded-full border-2 flex items-center justify-center"
              :class="{ 'border-primary': selected === template.id }"
            >
              <div 
                v-if="selected === template.id"
                class="size-2 rounded-full bg-primary"
              />
            </div>
            <div class="text-base font-bold">模板 {{ template.id }}</div>
          </div>

          <div class="overflow-hidden rounded h-40">
            <img :src="template.preview" alt="Preview" class="size-full">
          </div>

          <div class="flex items-center flex-wrap gap-1">
            <XTag v-for="tag in template.tags" :key="tag" size="sm" :label="tag" />
          </div>
        </div>
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
