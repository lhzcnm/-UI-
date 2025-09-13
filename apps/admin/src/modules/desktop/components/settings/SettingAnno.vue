<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting } from '@/api/settings'
import type { XBtnSplitOptions } from '@3un/ui';

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const { settings } = defineProps<SettingPlaneProps>()

const iStore = useSystemStore()
const router = useRouter()

const form = ref({
  enablePopupAnnc: settings.enablePopupAnnc,
  enablePaymentInfo: settings.enablePaymentInfo,
  enableScrollingAnnc: settings.enableScrollingAnnc,
})

const popupOptions: XBtnSplitOptions = [
  {
    label: '中文',
    command: () => handleEdit('popupAnnc'),
  },
  {
    label: '英文',
    command: () => handleEdit('popupAnncEn'),
  },
]

const scrollOptions: XBtnSplitOptions = [
  {
    label: '中文',
    command: () => handleEdit('scrollingAnnc'),
  },
  {
    label: '英文',
    command: () => handleEdit('scrollingAnncEn'),
  },
]

const paymentOptions: XBtnSplitOptions = [
  {
    label: '中文',
    command: () => handleEdit('paymentInfo'),
  },
  {
    label: '英文',
    command: () => handleEdit('paymentInfoEn'),
  },
]

const apiOptions: XBtnSplitOptions = [
  {
    label: '中文',
    command: () => handleEdit('apiUsageInfo'),
  },
  {
    label: '英文',
    command: () => handleEdit('apiUsageInfoEn'),
  },
]

function handleUpdate(val: boolean, name: string) {
  updateSetting([{ name, status: val }])
}

function handleEdit(type: keyof typeof settings) {
  router.push({ path: '/editor', query: {type} })
  iStore.showSetting = false
}
</script>

<template>
  <div class="flex-1 flex flex-col px-4 space-y-2">
    <FormField
      label="弹窗公告"
      desc="每次进入网站首页弹出的公告"
      :content-flex="false"
    >
      <XSwitch
        v-model="form.enablePopupAnnc"
        @change="handleUpdate($event, 'enablePopupAnnc')"
      />
      <XButtonSplit
        ui-trigger="z-50"
        openClick
        label="编辑" size="sm"
        :options="popupOptions"
      />
    </FormField>

    <FormField
      label="滚动公告"
      desc="首页顶部滚动公告"
      :content-flex="false"
    >
      <XSwitch
        v-model="form.enableScrollingAnnc"
        @change="handleUpdate($event, 'enableScrollingAnnc')"
      />
      <XButtonSplit
        ui-trigger="z-50"
        openClick
        label="编辑" size="sm"
        :options="scrollOptions"
      />
    </FormField>

    <FormField
      label="充值说明"
      desc="在支付页面显示的注意事项"
      :content-flex="false"
    >
      <XSwitch
        v-model="form.enablePaymentInfo"
        @change="handleUpdate($event, 'enablePaymentInfo')"
      />
      <XButtonSplit
        ui-trigger="z-50"
        openClick
        label="编辑" size="sm"
        :options="paymentOptions"
      />
    </FormField>

    <FormField
      label="API使用说明"
      desc="API KEY 使用说明"
      :content-flex="false"
    >
      <XButtonSplit
        ui-trigger="z-50"
        openClick
        label="编辑" size="sm"
        :options="apiOptions"
      />
    </FormField>
  </div>
</template>
