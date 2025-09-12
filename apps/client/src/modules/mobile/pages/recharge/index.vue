<script setup lang="ts">
import RechargeForm from './components/RechargeForm.vue'
import MembershipForm from './components/MembershipForm.vue'

import type { XSegmentedOption } from '@3un/ui'
import type { TabMode } from './utils'

interface RechargeMobileProps {
  tab?: TabMode
}

const props = defineProps<RechargeMobileProps>()
const activeTab = ref<TabMode>(props.tab || 'recharge')

const iStore = useSettingStore()
const { t } = useI18n()

await iStore.getSettings()

const options: XSegmentedOption[] = [
  { label: t('recharge.segment.balance'), value: 'recharge', icon: 'lucide:wallet' },
  { label: t('recharge.segment.member'), value: 'membership', icon: 'lucide:crown' }
]
</script>

<template>
  <div class="h-full">
    <BackHeader :title="t('recharge.title')" />
    <div class="px-3 pb-6 h-[calc(100%-var(--mobile-header-h))] overflow-y-auto">
      <XSegmented class="my-3 bg-card" v-model="activeTab" :options="options" />

      <RechargeForm v-show="activeTab === 'recharge'" />
      <MembershipForm v-show="activeTab === 'membership'" />
    </div>
  </div>
</template>
