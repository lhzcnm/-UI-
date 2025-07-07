<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting } from '@/api/settings'

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

function handleUpdate(val: boolean, name: string) {
  updateSetting([{ name, status: val }])
}

function handleEdit(type: string) {
  router.push({ path: '/editor', query: {type} })
  iStore.showSetting = false
}
</script>

<template>
  <div class="flex-1 flex flex-col px-4 divide-y">
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
        label="编辑" size="sm"
        icon="lucide:edit"
        @click="handleEdit('popupAnnc')"
      />
    </FormField>

    <FormField
      label="滚动公告"
      desc="滑动公告，用于显示服务价格调整信息"
      :content-flex="false"
    >
      <XSwitch
        v-model="form.enableScrollingAnnc"
        @change="handleUpdate($event, 'enableScrollingAnnc')"
      />
      <XButton
        label="编辑" size="sm"
        icon="lucide:edit"
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
        label="编辑" size="sm"
        icon="lucide:edit"
        @click="handleEdit('paymentInfo')"
      />
    </FormField>

    <FormField
      label="API使用说明"
      desc="API KEY 使用说明"
      :content-flex="false"
    >
      <XButton
        label="编辑" size="sm"
        icon="lucide:edit"
        @click="handleEdit('apiUsageInfo')"
      />
    </FormField>
  </div>
</template>
