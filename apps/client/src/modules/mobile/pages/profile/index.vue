<script setup lang="ts">
import InfoPlane from './components/InfoPlane.vue'
import { Icon } from '@iconify/vue'

import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Action } from './types'
import { maskText } from '@/utils'
import { ua } from '@3un/utils'

const store = useUserStore()
await store.getInfo(true)

const order = store.info.userOrder
const accountStats = [
  { label: '余额', value: store.info.credits },
  { label: '总订单', value: order.total },
  { label: '处理中', value: order.total - order.success - order.failed },
]

const operationOptions = [
  { label: '积分充值', icon: 'lucide:wallet', action: 'recharge' },
  { label: '充值记录', icon: 'lucide:shopping-cart', action: 'bill' },
  { label: '积分变更记录', icon: 'lucide:dollar-sign', action: 'credits' },
]

const settingOptions = [
  {
    label: '修改手机号',
    icon: 'lucide:smartphone',
    action: 'phone',
  },
  {
    label: '修改邮箱',
    icon: 'lucide:mail',
    action: 'email',
  },
  {
    label: '修改密码',
    icon: 'lucide:key',
    action: 'password',
  },
  !ua.isWechat && {
    label: '微信绑定',
    icon: 'hugeicons:wechat',
    action: 'wechat',
  },
].filter(item => !!item)

const visibleInfo = ref(false)
const visibleForm = ref(false)
const activeForm = ref<Action | null>(null)

const activeTitle = computed(() => {
  if (activeForm.value === 'phone') return '修改手机号'
  if (activeForm.value === 'email') return '修改邮箱'
  if (activeForm.value === 'wechat') return '微信绑定'
  return '修改密码'
})

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

function showForm(type: Action) {
  activeForm.value = type
  visibleForm.value = true
}

function closeForm() {
  activeForm.value = null
  visibleForm.value = false
}

async function handleRefresh() {
  await store.refreshApi()
  toast.success('刷新成功')
}

async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning('低于 10 积分不支持开通')
    return
  }

  await store.refreshApi()
  toast.success('开通成功')
}
</script>

<template>
  <div class="px-3">
    <section class="py-4">
      <div class="flex items-center space-x-3">
        <TheAvatar class="size-16" />

        <div class="flex-1">
          <div class="text-xl font-medium mb-1.5">{{ store.info.userName }}</div>
          <div class="space-x-2">
            <XTag color="blue">ID: {{ store.info.userId }}</XTag>
            <XTag color="rose">{{ store.info.pricePlan }}</XTag>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-3 p-4 bg-card rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-medium">我的账户</h3>
        <button
          class="flex-1 flex items-center justify-end space-x-1 text-sm text-muted-foreground"
          @click="visibleInfo = true"
        >
          详情 <Icon icon="lucide:chevron-right" class="size-4" />
        </button>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="stat in accountStats"
          :key="stat.label"
          class="text-center"
        >
          <div class="text-lg font-medium mb-1">{{ stat.value }}</div>
          <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
        </div>
      </div>
      <div class="flex space-x-2 mt-4">
        <XButton
          class="w-full" icon="lucide:dollar-sign"
          variant="soft" color="rose"
          @click="$router.push('/m/credits')"
        >
          账单
        </XButton>
        <XButton
          class="w-full" icon="lucide:wallet"
          @click="$router.push('/m/recharge')"
        >
          充值
        </XButton>
      </div>
    </section>

    <section v-if="store.info.bulkCheckApi" class="mb-3 p-4 bg-card rounded-lg">
      <h3 class="text-base font-medium mb-3">API 信息</h3>
      <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
        <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
        <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
      </div>
      <div class="flex items-center space-x-2 mt-3">
        <XButton
          icon="lucide:refresh-cw" class="flex-1" label="刷新"
          @click="handleRefresh"
        />
        <XButton
          icon="lucide:copy" class="flex-1" color="emerald" label="复制"
          @click="copy(store.info.bulkCheckApi)"
        />
      </div>
    </section>
    <section v-else class="mb-3 p-4 bg-card rounded-lg text-center">
      <XButton color="emerald" label="开通批量查询 API KEY" @click="handleOpenBulkCheckApi" />
    </section>

    <section class="mb-4 bg-card rounded-lg divide-y">
      <button
        v-for="option in operationOptions" :key="option.action"
        class="w-full flex items-center p-4 text-muted-foreground"
        @click="$router.push(`/m/${option.action}`)"
      >
        <Icon :icon="option.icon" class="size-5 mr-2" />
        <span class="flex-1 text-left">{{ option.label }}</span>
        <Icon icon="lucide:chevron-right" class="size-5" />
      </button>
    </section>

    <section class="mb-4 bg-card rounded-lg divide-y">
      <button
        v-for="option in settingOptions" :key="option.action"
        class="w-full flex items-center p-4 text-muted-foreground"
        @click="showForm(option.action as Action)"
      >
        <Icon :icon="option.icon" class="size-5 mr-2" />
        <span class="flex-1 text-left">{{ option.label }}</span>
        <Icon icon="lucide:chevron-right" class="size-5" />
      </button>
    </section>

    <SlideRight
      v-model="visibleForm"
      :title="activeTitle"
      header-class="border-b"
    >
      <PhoneForm
        v-if="activeForm === 'phone'"
        :on-close="closeForm"
        class="p-3"
      />
      <EmailForm
        v-else-if="activeForm === 'email'"
        :on-close="closeForm"
        class="p-3"
      />
      <WechatForm
        v-else-if="activeForm === 'wechat' && !ua.isWechat"
        :on-close="closeForm"
        class="p-3 space-y-3"
      />
      <PasswordForm
        v-else
        :on-close="closeForm"
        class="p-3 space-y-3"
      />
    </SlideRight>

    <InfoPlane v-model="visibleInfo" />
  </div>
</template>
