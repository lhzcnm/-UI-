<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting } from '@/api/settings'
import { xconfirm } from '@3un/utils'

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const { settings } = defineProps<SettingPlaneProps>()

const form = ref({
  enablePopupAnnc: settings.enablePopupAnnc,
  enablePaymentInfo: settings.enablePaymentInfo,
  enableScrollingAnnc: settings.enableScrollingAnnc,
})

function handleUpdate(val: boolean, name: string) {
  updateSetting([{ name, status: val }])
}

function handleEdit(type: keyof typeof settings) {
  const text = settings[type].toString()
  xconfirm({ title: '预览', text })
}
</script>

<template>
  <div class="flex-1 flex flex-col divide-y">
    <FormField
      label="弹窗公告"
      desc="每次进入网站首页弹出的公告"
      :content-flex="false"
    >
      <XSwitch
        v-model="form.enablePopupAnnc"
        @change="handleUpdate($event, 'enablePopupAnnc')"
      />
      <XButton
        label="浏览" size="sm"
        icon="lucide:eye"
        @click="handleEdit('popupAnnc')"
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
      <XButton
        label="浏览" size="sm"
        icon="lucide:eye"
        @click="handleEdit('scrollingAnnc')"
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
      <XButton
        label="浏览" size="sm"
        icon="lucide:eye"
        @click="handleEdit('paymentInfo')"
      />
    </FormField>

    <FormField
      label="API使用说明"
      desc="API KEY 使用说明"
      :content-flex="false"
    >
      <XButton
        label="浏览" size="sm"
        icon="lucide:eye"
        @click="handleEdit('apiUsageInfo')"
      />
    </FormField>
  </div>
</template>
