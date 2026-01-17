<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { updateService } from '@/api/services'
import { updateSetting } from '@/api/settings'

import { EDITOR_STORE } from '../utils'
import { updateActivity } from '@/api/activity'

interface TheProps {
  getHtml?: () => string
  setHtml?: (html: string) => void
}

interface OptionItem {
  label: string
  value: string
  icon: string
}

const props = defineProps<TheProps>()

const serviceStore = useServiceStore()
const mode = import.meta.env.VITE_APP_MODE

const store = inject(EDITOR_STORE)!
const previewHtml = ref('')

const options: OptionItem[] = [
  mode === "SanHe" && { label: '更新公告', value: 'adminRemainder', icon: 'solar:diploma-verified-outline' },
  { label: '中文服务说明', value: 'service', icon: 'lucide:file-text' },
  { label: '英文服务说明', value: 'service-en', icon: 'lucide:globe' },
  { label: '中文活动说明', value: 'activity', icon: 'lucide:balloon' },
  { label: '滑动公告', value: 'scrollingAnnc', icon: 'lucide:scroll-text' },
  { label: '滑动公告EN', value: 'scrollingAnncEn', icon: 'lucide:scroll-text' },
  { label: '弹窗公告', value: 'popupAnnc', icon: 'lucide:message-square' },
  { label: '弹窗公告EN', value: 'popupAnncEn', icon: 'lucide:message-square' },
  { label: '充值说明', value: 'paymentInfo', icon: 'lucide:credit-card' },
  { label: '充值说明EN', value: 'paymentInfoEn', icon: 'lucide:credit-card' },
  { label: 'API使用说明', value: 'apiUsageInfo', icon: 'lucide:key-round' },
  { label: 'API使用说明EN', value: 'apiUsageInfoEn', icon: 'lucide:key-round' },
  { label: '商城下单提示', value: 'mallWarmReminderZH', icon: 'lucide:credit-card' },
  { label: '商城下单提示EN', value: 'mallWarmReminderEN', icon: 'lucide:credit-card' },
].filter((o): o is OptionItem => Boolean(o))

const selectedOption = computed(() => 
  options.find(opt => opt.value === store.selectedType)
)

function handleSelectService(value: number) {
  const isEn = store.selectedType.endsWith('en')
  store.selectedService = value

  const service = serviceStore.itemMap.get(value)!
  const content = isEn ? service.mustReadLocal : service.mustRead
  props.setHtml!(content || '')
  previewHtml.value = content || ''
}

function handleSelectType(value: string) {
  if (value.startsWith('service') || value.startsWith('activity')) return

  const content = store.settings[value] as string

  props.setHtml!(content || '')
  previewHtml.value = content || ''
}

async function handleSave() {
  if (!store.selectedType) {
    toast.error('请选择编辑类型')
    return
  }

  const html = props.getHtml!() || ''

  if (store.selectedType.startsWith('service')) {
    const isEn = store.selectedType.endsWith('en')

    await updateService({
      packageId: store.selectedService,
      mustRead: isEn ? undefined : html,
      mustReadLocal: isEn ? html : undefined,
    })
  }
  else if (store.selectedType.startsWith('activity')) {
    const activity = store.activityMap.get(store.selectActivity)!
    await updateActivity({
      ...activity,
      id: store.selectActivity,
      description: html,
    })
  } else {
    try {
      await updateSetting([
        { name: store.selectedType, content: html },
      ])

      store.settings[store.selectedType] = html
    } catch {
      return toast.error("未知错误, 请重试")
    }
  }

  toast.success('保存成功')
}

function handleSelectActivity(value: number) {
  store.selectActivity = value

  const activity = store.activityMap.get(value)
  const content = activity?.description
  props.setHtml!(content ?? '')
  previewHtml.value = content ?? ''
}

function handleRefresh() {
  previewHtml.value = props.getHtml!() || ''
}
</script>

<template>
  <div class="flex h-full flex-col bg-zinc-50 dark:bg-zinc-900/50">
    <div class="p-4 space-y-3 border-b bg-card">
      <div>
        <label class="mb-2 block text-sm text-label">
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
          />
        </XSelect>
      </div>

      <div v-show="store.selectedType.startsWith('service')">
        <label class="mb-2 block text-sm text-label">
          选择服务
        </label>
        <SelectService
          v-model="store.selectedService"
          placement="bottom-end"
          ui-trigger="w-full"
          sync-width="force"
          @selected="handleSelectService"
        />
      </div>

      <div v-show="store.selectedType.startsWith('activity')">
        <label class="mb-2 block text-sm text-label">
          选择活动
        </label>
        <SelectActivity
          :activitys="store.activityMap"
          v-model="store.selectActivity"
          @selected="handleSelectActivity"
        />
      </div>
    </div>

    <div
      v-if="selectedOption"
      class="flex items-center space-x-3 border-b bg-card p-4"
    >
      <div class="flex size-10 items-center justify-center rounded bg-primary/20">
        <Icon :icon="selectedOption.icon" class="size-5 text-primary" />
      </div>

      <h3 class="flex-1 text-label">{{ selectedOption.label }}</h3>
      <XButton label="保存" @click="handleSave" />
    </div>

    <div class="flex-1 min-h-0 flex flex-col">
      <div class="flex items-center justify-between border-b bg-card px-4 py-2">
        <h4 class="text-sm text-label">内容预览</h4>
        <XButton
          label="刷新" size="sm"
          variant="outline"
          @click="handleRefresh"
        />
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div
          v-if="previewHtml" v-html="previewHtml"
          class="tiptap max-w-none rounded-lg border bg-card p-4"
        />

        <div v-else class="flex h-full items-center justify-center">
          <div class="text-center text-muted-foreground">
            <Icon icon="lucide:eye-off" class="inline-block mb-2 size-8" />
            <p class="text-sm">暂无内容预览</p>
            <p class="mt-1 text-xs">开始编辑以查看预览</p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t bg-card px-4 py-2">
      <span class="text-xs text-muted-foreground">
        字符数: {{ previewHtml.length }}
      </span>
    </div>
  </div>
</template>
