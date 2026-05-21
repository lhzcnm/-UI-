<script setup lang="ts">
import { type XBtnSplitOptions } from '@3un/ui'

import { ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import { stripHtml } from '@3un/utils'
import { ref } from 'vue'
import { useClipboard, useThrottleFn } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'
import { HISTORY_STORE } from '../utils'
import { getLanuagestring } from '@/utils/constant'

interface TableActionProps {
  index: number
  row: Order
}

const { row, index } = defineProps<TableActionProps>()

const status = {
  isSuccess: row.status === ORDER_STATUS.SUCCESS,
  isFailed: row.status === ORDER_STATUS.FAILED,
  isProcessing: row.status === ORDER_STATUS.PROCESSING,
  isWait: row.status === ORDER_STATUS.WAIT
}

const verify = {
  isNormal: row.verify === ORDER_VERIFY.NORMAL,
  isReplied: row.verify === ORDER_VERIFY.REPLIED,
  isSolved: row.verify === ORDER_VERIFY.SOLVED,
  isRefunded: row.verify === ORDER_VERIFY.REFUNDED
}

const store = inject(HISTORY_STORE)!
const { services } = useServiceStore()
const focreHide = ref(false)

const { t } = useI18n()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success(t('submit.success', { action: t('action.copy') })))

const iStore = useSettingStore()
const systemStore = useSystemStore()

const isUnlockService = computed(() => {
  const service = services.get(row.serviceId)
  if (!service) return false
  return service.isUnlock
})

const serviceVertifyType = computed(() => {
  return isUnlockService.value ? iStore.settings.unlockValidation : iStore.settings.queryValidation
})

const isShowVerify = computed(() => {
  const service = services.get(row.serviceId)
  if (!service) return false

  return serviceVertifyType.value &&
    service.verify &&
    verify.isNormal &&
    status.isSuccess &&
    !focreHide.value
})

const handleRefresh = useThrottleFn(() => {
  orderApi.item(row.id).then(({ data }) => {
    toast.success(t('submit.success', { action: t('action.refresh') }))

    if (data.status === ORDER_STATUS.SUCCESS) {
      focreHide.value = true
    }

    store.orders.list[index] = {
      ...store.orders.list[index],
      ...data
    }
  })
}, 500)

function handleVerify() {
  const { id, createTime } = row
  const createUnix = new Date(createTime).getTime()
  const diff = Date.now() - createUnix
  const daysDiff = diff / (24 * 3600 * 1000)

  if (daysDiff > 3) {
    toast.info(t('order.prompt.orderTimeout'))
    return
  }

  orderApi.verify(id, { isUnlock: isUnlockService.value, serviceId: row.serviceId }).then(() => {
    toast.success(t('order.prompt.vertified'))

    focreHide.value = true
    store.orders.list[index] = {
      ...store.orders.list[index],
      verify: ORDER_VERIFY.REPLIED
    }
  })
}

function handleCopy() {
  const items = row.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}

async function getOrderDetail() {
  const { data } = await orderApi.item(row.id)
  store.orders.list[index] = {
    ...store.orders.list[index],
    recommends: data.recommends,
  }
}

async function openUplockRecommend() {
  await getOrderDetail()
  if (row.recommends?.length === 0) {
    toast.warning(getLanuagestring('no_unlock_recommend', systemStore.lang))
    return
  }

  store.index = index
  store.visibleUnlockRecommend = true
}

const btnSplits: XBtnSplitOptions = [
  ...(isShowVerify.value ? [{ label: t('order.button.table.vertify'), command: handleVerify }] : []),
  ...(status.isProcessing && !focreHide.value ? [{ label: t('button.fresh'), command: handleRefresh }] : []),
  ...(!isUnlockService.value ? [{label: getLanuagestring('unlock_recommend_column', systemStore.lang), command: openUplockRecommend}] : [])
]
</script>

<template>
  <XButtonSplit
    :options="btnSplits"
    :label="t('order.button.table.copy')"
    size="sm"
    @click="handleCopy"
  />
</template>
