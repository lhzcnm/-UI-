<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twMerge, twJoin } from 'tailwind-merge'
import { useClipboard, useThrottleFn } from '@vueuse/core'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'
import {
  ORDER_STATUS_MAP,
  ORDER_VERIFY_MAP,
  ORDER_STATUS,
  ORDER_VERIFY,
} from '@3un/utils'
import { stripHtml } from '@3un/utils'

interface OrderCardProps {
  order: Order
  isSubmit?: boolean
  class?: string
  index?: number
  visibleImage?: boolean
}

interface OrderCardEmits {
  generate: [order: Order]
  refresh: [order: Order, respOrder: Order]
}

const props = withDefaults(
  defineProps<OrderCardProps>(),
  {
    visibleImage: true,
  },
)
const emits = defineEmits<OrderCardEmits>()
const { isSubmit, class: className } = props
// const { t } = useI18n()
const localStore = useLocalStore()

// const order = ref(props.order)
const serviceStore = useServiceStore()
const serviceName = computed(() => {
  const id = props.order.serviceId
  const service = serviceStore.services.get(id)
  return service ? service.title : '--'
})

const status = computed(() => ({
  isSuccess: props.order.status === ORDER_STATUS.SUCCESS,
  isFailed: props.order.status === ORDER_STATUS.FAILED,
  isProcessing: props.order.status === ORDER_STATUS.PROCESSING,
  isWait: props.order.status === ORDER_STATUS.WAIT,
}))

const verify = computed(() => ({
  isNormal: props.order.verify === ORDER_VERIFY.NORMAL,
  isReplied: props.order.verify === ORDER_VERIFY.REPLIED,
  isSolved: props.order.verify === ORDER_VERIFY.SOLVED,
  isRefunded: props.order.verify === ORDER_VERIFY.REFUNDED,
}))

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success(localStore.localData['history_TableCopySuccess']))

const iStore = useSettingStore()

const isUnlockService = computed(() => {
  const service = serviceStore.services.get(props.order.serviceId)
  if (!service) return false
  return service.isUnlock
})

const serviceVertifyType = computed(() => {
  return isUnlockService.value ? iStore.settings.unlockValidation : iStore.settings.queryValidation
})

const isShowVerify = computed(() => {
  const service = serviceStore.services.get(props.order.serviceId)
  if (!service) return false

  return serviceVertifyType.value &&
    service.verify &&
    verify.value.isNormal &&
    status.value.isSuccess
})

const handleRefresh = useThrottleFn(() => {
  orderApi.item(props.order.id).then((response) => {
    // props.order = response.data
    emits('refresh', props.order, response.data)
    toast.success(localStore.localData['history_SuccessRefresh'])
  })
}, 500)

const orderImei = computed(() => {
  const result = props.order.result
  if (!result) return ""

  const splitStr = result.split("<br>")

  for (let item of splitStr) {
    if (/^(串号|串号2|IMEI|IMEI2)/.test(item.trim())) {
      const parts = item.split(/[:：]/)
      if (parts.length > 1) {
        return parts[1].trim()
      }
    }
  }

  return ""
})
function handleVerify() {
  const { id, createTime } = props.order
  const createUnix = new Date(createTime).getTime()
  const diff = Date.now() - createUnix
  const daysDiff = diff / (24 * 3600 * 1000)

  if (daysDiff > 3) {
    toast.info(localStore.localData['history_Verification_Toast'])
    return
  }

  window.confirm(localStore.localData['history_VerifyOrder']) && (() => {
    orderApi.verify(id, { isUnlock: isUnlockService.value, serviceId: props.order.serviceId }).then(() => {
      props.order.verify = ORDER_VERIFY.REPLIED
      toast.success(localStore.localData['history_SubmitVerification'])
    })
  })()
}

function handleCopy() {
  const items = props.order.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}
</script>

<template>
  <div
    :class="twMerge(
      'bg-card rounded-lg p-4 space-y-4 shadow-sm',
      className,
    )"
  >
    <div class="flex items-center justify-between space-x-3">
      <span
        v-if="isSubmit"
        :class="twJoin(
          'relative flex items-center justify-center',
          'min-w-8 h-8 px-2 text-white font-bold rounded-lg text-sm',
          'bg-gradient-to-br from-primary/80 to-primary/40',
          'shadow-lg shadow-primary/20 backdrop-blur-sm',

          'before:absolute before:top-0 bottom-0 left-0 right-0 before:rounded-lg',
          'before:border-2 before:border-primary/30 before:border-r-primary/60',
          'before:transform before:rotate-3 before:z-[-1]',
        )"
      >
        <span class="transform -rotate-3">{{ index }}</span>
      </span>
      <span v-else class="text-base font-medium">{{ order.id }}</span>
      <div class="flex space-x-2">
        <XTag :color="ORDER_STATUS_MAP[order.status].color" :label="localStore.localData[ORDER_STATUS_MAP[order.status].key!]" />
        <XTag v-if="!isSubmit" :color="ORDER_VERIFY_MAP[order.verify].color" :label="localStore.localData[ORDER_VERIFY_MAP[order.verify].key!]" />
      </div>
    </div>

    <div class="text-sm whitespace-pre">
      <div class="flex items-start">
        <span class="text-muted-foreground shrink-0">{{ localStore.localData['history_TableHeadServuce'] }}: </span>
        <span class="font-medium break-all whitespace-pre-line">{{ serviceName }}</span>
      </div>

      <div class="flex items-center group">
        <div class="flex items-center">
          <span class="text-muted-foreground shrink-0">{{ localStore.localData['history_Source'] }}: </span>
          <span class="font-medium font-mono">{{ order.imei }}</span>
        </div>
        <button
          :class="twJoin(
            'p-1.5 text-muted-foreground',
            'opacity-0 group-hover:opacity-100 transition-opacity',
          )"
          @click="copy(order.imei)"
        >
          <Icon icon="lucide:clipboard-copy" class="size-4" />
        </button>
      </div>

      <div v-if="order.createTime" class="flex items-center">
        <span class="text-muted-foreground shrink-0">{{ localStore.localData['history_TableHeadSubmitTime'] }}: </span>
        <span class="font-medium">{{ order.createTime }}</span>
      </div>

      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">{{ localStore.localData['history_Points'] }}: </span>
        <span
          :class="twJoin(
            'font-medium text-danger',
            status.isFailed && 'line-through',
          )"
        >
          {{ order.credits }}
        </span>
        <span v-if="status.isFailed" class="text-xs">{{ localStore.localData['history_Returned'] }}</span>
      </div>
    </div>

    <div class="text-sm">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-muted-foreground">{{ localStore.localData['history_TableHeadResult'] }}: </span>
        <div class="flex items-center space-x-3">
          <button
            v-if="!isSubmit && status.isProcessing"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleRefresh"
          >
            <Icon icon="lucide:refresh-cw" class="size-4" />
            <span class="text-xs">{{ localStore.localData['history_TableRefresh'] }}</span>
          </button>

          <button
            v-if="isShowVerify"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleVerify"
          >
            <Icon icon="lucide:info" class="size-4" />
            <span class="text-xs">{{ localStore.localData['history_Verification'] }}</span>
          </button>

          <button
            v-if="status.isSuccess"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleCopy"
          >
            <Icon icon="lucide:clipboard-copy" class="size-4" />
            <span class="text-xs">{{ localStore.localData['history_Copy'] }}</span>
          </button>

          <button
            v-if="status.isSuccess && visibleImage"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="emits('generate', order)"
          >
            <Icon icon="lucide:instagram" class="size-4" />
            <span class="text-xs">{{ localStore.localData['history_GenerateImages'] }}</span>
          </button>
        </div>
      </div>

      <div
        class="bg-muted rounded p-3 whitespace-pre-line overflow-x-auto"
        v-html="order.result.trim() || '订单处理中...'"
      />
    </div>

    <div class="text-sm" v-if="order.remark">
      <div class="text-muted-foreground mb-1.5">{{ localStore.localData['history_TableHeadRemarks'] }}: </div>
      <div class="bg-muted rounded p-3">
        {{ order.remark }}
      </div>
    </div>

    <div class="text-sm" v-if="order.recommends && order.recommends.length">
      <div class="text-muted-foreground mb-1.5">{{ localStore.localData['history_UnlocedService'] }}: </div>
      <ol class="bg-muted rounded p-3 list-decimal list-inside">
        <li v-for="recommend in order.recommends" :key="recommend.packageId">
          <a
            :href="`/m/submit/${recommend.packageId}/${orderImei}`"
            class="underline active:text-success"
          >
            {{ recommend.packageId }} - {{ recommend.name }}
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>
