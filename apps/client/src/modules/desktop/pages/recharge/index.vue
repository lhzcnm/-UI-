<script setup lang="ts">
import RechargeForm from './components/RechargeForm.vue'
import MembershipForm from './components/MembershipForm.vue'
import RechargeHistory from './components/RechargeHistory.vue'
import RechargeQrcode from './components/RechargeQrcode.vue'
import VoucherForm from './components/VoucherForm.vue'

import type { XSegmentedOption } from '@3un/ui'
import type { RechargeStore, TabMode } from './utils'
import { RECHARGE_STORE } from './utils'
import { createList } from '@/utils'

interface RechargeIndexProps {
  tab?: TabMode
}

const uStore = useUserStore()

const props = defineProps<RechargeIndexProps>()

const store: RechargeStore = reactive({
  url: '',
  visible: false,
  isComplete: false,
  refresh: false,
  timer: 0,
  bills: createList(),
})

watch(
  () => store.refresh,
  () => {
    uStore.updateCredit()
  }
)

provide(RECHARGE_STORE, store)

const activeTab = ref<TabMode>(props.tab || 'recharge')

const { t, locale } = useI18n()

const options: XSegmentedOption[] = [
  { label: t('recharge.segment.balance'), value: 'recharge', icon: 'lucide:wallet' },
  { label: t('recharge.segment.member'), value: 'membership', icon: 'lucide:crown' },
  { label: t('recharge.segment.voucher'), value: 'voucher', icon: 'lucide:ticket-check' }
]

const titleOptions = {
  recharge: {
    name: "积分充值",
    nameEn: "Add Funds",
  },
  membership: {
    name: "会员充值",
    nameEn: "MemberShip Fund",
  },
  voucher: {
    name: "积分券兑换",
    nameEn: "Voucher Exchange"
  }
}

const displayTitle = computed(() => {
  const option = titleOptions[activeTab.value]
  return locale.value === 'zh' ? option.name : option.nameEn
})
</script>

<template>
  <div class="p-4 h-full flex space-x-4">
    <section class="w-[30rem] shrink-0">
      <div class="flex flex-col items-center justify-between mb-3 space-y-2">
        <h2 class="text-xl font-medium">{{ displayTitle }}</h2>
        <XSegmented
          v-model="activeTab"
          :options="options"
          class="bg-card"
        />
      </div>

      <RechargeForm v-show="activeTab === 'recharge'" />
      <MembershipForm v-show="activeTab === 'membership'" />
      <VoucherForm v-show="activeTab === 'voucher'" />
      <RechargeQrcode />
    </section>

    <RechargeHistory />
  </div>
</template>
