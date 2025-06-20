<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'

import { toast } from 'vue-sonner'

import { updateService } from '@/api/services'
import { updateSetting, getSettings } from '@/api/settings'

import type { EditorStore } from './utils'
import { EDITOR_STORE } from './utils'

const store: EditorStore = reactive({
  settings: {},

  selectedService: 0,
  selectedType: '',
  result: '',
})

provide(EDITOR_STORE, store)

await getSetting()
async function getSetting() {
  const data = await getSettings()
  store.settings = {}

  for (const item of data) {
    if (item.content) {
      store.settings[item.name] = item.content
      continue
    }
    if (item.status) {
      store.settings[item.name] = item.status
    }
  }
}

const serviceStore = useServiceStore()
const editor = useTemplateRef('editor')

// 新增状态
const isSaving = ref(false)
const previewHtml = ref('')

async function handleSave() {
  if (!store.selectedType) {
    toast.error('请选择编辑类型')
    return
  }

  isSaving.value = true
  const html = editor.value!.getHtml()

  try {
    if (store.selectedType.startsWith('service')) {
      const isEn = store.selectedType.endsWith('en')

      await updateService({
        packageId: store.selectedService,
        mustRead: isEn ? undefined : html,
        mustReadLocal: isEn ? html : undefined,
      })
    }
    else {
      await updateSetting([
        { name: store.selectedType, content: html },
      ])
    }

    toast.success('保存成功')
  } finally {
    isSaving.value = false
  }
}

function handleSelectService(value: number) {
  const isEn = store.selectedType.endsWith('en')
  store.selectedService = value

  const service = serviceStore.itemMap.get(value)!
  const content = isEn ? service.mustReadLocal : service.mustRead
  editor.value!.setHtml(content || '')
  updatePreview()
}

function handleSelectType(value: string) {
  if (value.startsWith('service')) return

  const content = store.settings[value] as string
  editor.value!.setHtml(content || '')
  updatePreview()
}

function updatePreview() {
  previewHtml.value = editor.value?.getHtml() || ''
}

// 监听编辑器变化更新预览
watch(
  () => store.result,
  () => {
    updatePreview()
  }
)

const options = [
  { label: '中文服务说明', value: 'service', icon: 'lucide:file-text' },
  { label: '英文服务说明', value: 'service-en', icon: 'lucide:globe' },
  { label: '滑动公告', value: 'scrollingAnnc', icon: 'lucide:scroll-text' },
  { label: '弹窗公告', value: 'popupAnnc', icon: 'lucide:message-square' },
  { label: '充值说明', value: 'paymentInfo', icon: 'lucide:credit-card' },
]

const selectedOption = computed(() => 
  options.find(opt => opt.value === store.selectedType)
)

const selectedServiceInfo = computed(() => {
  if (!store.selectedService) return null
  return serviceStore.itemMap.get(store.selectedService)
})
</script>

<template>
  <SplitPlane>
    <template #left>
      <TheEditor ref="editor" />
    </template>
    <template #right>
      <div class="flex h-full flex-col bg-gray-50/50">
        <!-- 头部操作区 -->
        <div class="border-b bg-white p-4">
          <div class="space-y-3">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">
                编辑类型
              </label>
              <XSelect
                v-model="store.selectedType"
                placeholder="选择编辑类型"
                ui-trigger="w-full"
                @selected="handleSelectType"
              >
                <XSelectItem
                  v-for="item in options" 
                  :key="item.value"
                  :value="item.value" 
                  :label="item.label"
                >
                  <div class="flex items-center space-x-2">
                    <Icon :name="item.icon" class="size-4" />
                    <span>{{ item.label }}</span>
                  </div>
                </XSelectItem>
              </XSelect>
            </div>

            <div v-if="store.selectedType.startsWith('service')">
              <label class="mb-2 block text-sm font-medium text-gray-700">
                选择服务
              </label>
              <SelectService
                v-model="store.selectedService"
                ui-trigger="w-full"
                @selected="handleSelectService"
              />
            </div>
          </div>
        </div>

        <!-- 当前编辑信息 -->
        <div v-if="selectedOption" class="border-b bg-white p-4">
          <div class="flex items-center space-x-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100">
              <Icon :name="selectedOption.icon" class="size-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">
                {{ selectedOption.label }}
              </h3>
                             <p v-if="selectedServiceInfo" class="text-sm text-gray-500">
                 {{ selectedServiceInfo.packageTitle }}
               </p>
              <p v-else-if="!store.selectedType.startsWith('service')" class="text-sm text-gray-500">
                系统设置项
              </p>
            </div>
            <XButton 
              :label="isSaving ? '保存中...' : '保存'"
              :loading="isSaving"
              :disabled="!store.selectedType"
              @click="handleSave" 
            />
          </div>
        </div>

        <!-- 预览区域 -->
        <div class="flex-1 overflow-hidden">
          <div class="flex h-full flex-col">
            <div class="border-b bg-white px-4 py-2">
              <h4 class="text-sm font-medium text-gray-700">内容预览</h4>
            </div>
            <div class="flex-1 overflow-auto p-4">
              <div 
                v-if="previewHtml"
                class="prose prose-sm max-w-none rounded-lg border bg-white p-4"
                v-html="previewHtml"
              />
              <div v-else class="flex h-full items-center justify-center">
                <div class="text-center text-gray-400">
                  <Icon name="lucide:eye-off" class="mx-auto mb-2 size-12" />
                  <p class="text-sm">暂无内容预览</p>
                  <p class="mt-1 text-xs">开始编辑以查看预览</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部状态栏 -->
        <div class="border-t bg-white px-4 py-2">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>
              字符数: {{ previewHtml.length }}
            </span>
            <span v-if="isSaving" class="flex items-center space-x-1">
              <Icon name="lucide:loader-2" class="size-3 animate-spin" />
              <span>保存中...</span>
            </span>
          </div>
        </div>
      </div>
    </template>
  </SplitPlane>
</template>
