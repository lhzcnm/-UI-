<script setup lang="ts">
import RechargeForm from './components/RechargeForm.vue'
import MembershipForm from './components/MembershipForm.vue'
import VoucherForm from './components/VoucherForm.vue'

import type { XSegmentedOption } from '@3un/ui'
import type { TabMode } from './utils'
import { type ActivityItem, rechargeApi } from '@/api/recharge'
import { xconfirm } from '@3un/utils'

interface RechargeMobileProps {
  tab?: TabMode
}

const props = defineProps<RechargeMobileProps>()
const activeTab = ref<TabMode>(props.tab || 'recharge')
const activity = shallowRef<ActivityItem | null>(null)

const iStore = useSettingStore()
const { locale } = useI18n()
const localStore = useLocalStore()

await iStore.getSettings()
await iStore.getHandleFee()

const options: XSegmentedOption[] = [
  { label: localStore.localData['recharge_Balance'], value: 'recharge', icon: 'lucide:wallet' },
  { label: localStore.localData['recharge_Membership'], value: 'membership', icon: 'lucide:crown' },
  { label: localStore.localData['recharge_Voucher'], value: 'voucher', icon: 'lucide:ticket-check' },
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

async function getCurActivity() {
  try {
    const { data } = await rechargeApi.activity()

    if (data.length > 0) {
      activity.value = data[0]
    }
  } catch {}
}

function activityToHtml(activity: ActivityItem) {
  const description = `
    <div class="mb-4 text-[18px] leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 rounded-md p-2">
      ${activity.description}
    </div>
  `

  const rules = activity.rules.map((item, index) => {
    // const isQuery = item.creditsUsageType === VOUCHER_TYPE.QUERY
    // const isUnlock = item.creditsUsageType === VOUCHER_TYPE.UNLOCK
    return `
      <div
        class="mb-2 rounded px-3 py-2
               bg-slate-50/40 dark:bg-slate-900/40
               border border-slate-800/60">
        <div class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span class="text-slate-500 select-none">
            ${index + 1}.
          </span>

          <span>
            充值满
            <span class="mx-1 font-medium text-danger">
              ${item.minAmount}
            </span>
            ，赠送
            <span class="mx-1 font-medium text-success">
              ${item.bonusAmount}%
            </span>
            <span>积分</span>
          </span>
        </div>
      </div>
    `
  }).join("")

  const rulesBlock = `
    <div class="mb-4">
      <h4 class="mb-2 text-xs tracking-wide text-slate-600 dark:text-slate-400">
        活动规则
      </h4>
      ${rules}
    </div>
  `

  const duration = `
    <div
      class="mt-4 pt-3
             border-t border-slate-800
             text-slate-600 dark:text-slate-400
             font-medium
             whitespace-pre-line">
      活动时间：
      <span class="text-slate-700 dark:text-slate-400">
        ${activity.startTime} - ${activity.endTime}
      </span>
    </div>
  `

  const end = `
    <div class="text-center text-base text-danger">最终解释权归 ${iStore.settings.title} 所有</div>
  `

  return `
    <div class="activity-content">
      ${description}
      ${rulesBlock}
      ${duration}
      ${end}
    </div>
  `
}

await getCurActivity()

onMounted(() => {
  if (activity.value !== null) {
    xconfirm({
      title: activity.value.name,
      text: activityToHtml(activity.value),
    })
  }
})
</script>

<template>
  <div class="h-full">
    <BackHeader :title="displayTitle" />
    <div class="px-3 pb-6 h-[calc(100%-var(--mobile-header-h))] overflow-y-auto">
      <XSegmented class="my-3 bg-card" v-model="activeTab" :options="options" />

      <RechargeForm v-show="activeTab === 'recharge'" />
      <MembershipForm v-show="activeTab === 'membership'" />
      <VoucherForm v-show="activeTab === 'voucher'" />
    </div>
  </div>
</template>
