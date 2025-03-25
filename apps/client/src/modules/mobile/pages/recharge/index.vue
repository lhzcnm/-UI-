<script setup lang="ts">
import RechargeForm from './components/RechargeForm.vue'
import MembershipForm from './components/MembershipForm.vue'

import type { SegmentedOption } from '@3un/ui'
import type { TabMode } from './utils'

interface RechargeMobileProps {
  tab?: TabMode
}

const props = defineProps<RechargeMobileProps>()
const activeTab = ref<TabMode>(props.tab || 'recharge')

const iStore = useSettingStore()
await iStore.getSettings()

const options: SegmentedOption[] = [
  { label: '余额充值', value: 'recharge', icon: 'lucide:wallet' },
  { label: '开通会员', value: 'membership', icon: 'lucide:crown' }
]
</script>

<template>
  <div class="h-full">
    <BackHeader title="积分充值" />
    <div class="px-3 pb-6 h-[calc(100%-var(--mobile-header-h))] overflow-y-auto">
      <XSegmented class="my-3" v-model="activeTab" :options="options" />

      <RechargeForm v-show="activeTab === 'recharge'" />
      <MembershipForm v-show="activeTab === 'membership'" />
    </div>
  </div>
</template>
