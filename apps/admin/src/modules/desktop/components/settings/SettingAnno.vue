<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting, updateConfig } from '@/api/settings'

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const { settings, configs } =
  defineProps<SettingPlaneProps>()

const form = computed(() => ({
  popupAnnc: settings.popupAnnc,
  paymentInfo: settings.paymentInfo,
  scrollingAnnc: settings.scrollingAnnc,
}))

const form2 = ref({
  enablePopupAnnc: settings.enablePopupAnnc,
  enablePaymentInfo: settings.enablePaymentInfo,
  enableScrollingAnnc: settings.enableScrollingAnnc,
})
</script>

<template>
  <div class="flex-1 flex flex-col px-3 divide-y">
    <FormField
      label="弹窗公告"
      desc="每次进入网站首页弹出的公告"
      :content-flex="false"
    >
      <XSwitch v-model="form2.enablePopupAnnc" />
      <XButton icon="lucide:edit" label="编辑" size="sm" />
    </FormField>
    <FormField
      label="滚动公告"
      desc="滑动公告，用于显示服务价格调整信息"
      :content-flex="false"
    >
      <XSwitch v-model="form2.enableScrollingAnnc" />
      <XButton icon="lucide:edit" label="编辑" size="sm" />
    </FormField>
    <FormField
      label="充值说明"
      desc="在支付页面显示的注意事项"
      :content-flex="false"
    >
      <XSwitch v-model="form2.enablePaymentInfo" />
      <XButton icon="lucide:edit" label="编辑" size="sm" />
    </FormField>
  </div>
</template>
