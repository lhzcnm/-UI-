<script setup lang="ts">
import { xconfirm, PAYMENT_STATUS_MAP, PAYMENT_METHOD_MAP } from '@3un/utils'
import { Icon } from '@iconify/vue'

import type { Recharge } from '@/inters/recharge'
import { deleteRecharges } from '@/api/recharge'
import { RECHARGE_STORE } from '../utils'
import { twJoin } from 'tailwind-merge'

interface RechargeActionProps {
  item: Recharge
  index: number
}

const props = defineProps<RechargeActionProps>()
const store = inject(RECHARGE_STORE)!

const packageStore = usePackageStore()
const shop = packageStore.packageMap.get(props.item.shopId)

function openUpdate() {
  store.formUpdate = {
    userId: props.item.userId,
    paymentId: props.item.paymentId,
    paymentStatus: props.item.paymentStatus,
    paymentMethod: props.item.paymentMethod,
    comments: props.item.comments || undefined,
    byAdmin: props.item.byAdmin,
  }

  store.visibleUpdate = true
  store.index = props.index
}

async function handleDelete() {
  if (!await xconfirm('确定删除该记录吗？')) return

  deleteRecharges([props.item.paymentId]).then(() => {
    store.recharges.list.splice(props.index, 1)
    store.recharges.total--
  })
}
</script>

<template>
  <div class="bg-card border rounded-lg" @click="openUpdate">
    <div class="flex items-center justify-between p-3">
      <h3>{{ item.paymentId }}</h3>
      <div class="flex items-center space-x-2">
        <XTag size="sm" v-bind="PAYMENT_STATUS_MAP[item.paymentStatus]" />
        <XTag size="sm" v-bind="PAYMENT_METHOD_MAP[item.paymentMethod]" />
      </div>
    </div>

    <div
      :class="twJoin(
        'grid grid-cols-2 gap-2 px-3 py-2 mx-3',
        'border rounded-lg text-sm text-muted-foreground',
      )"
    >
      <div class="flex-1 text-center border-r border-dashed">
        <div class="flex items-center justify-center">
          <Icon icon="lucide:credit-card" class="mr-1" />
          <span>账单金额</span>
        </div>
        <div class="text-lg font-bold text-primary">￥{{ item.amount }}</div>
      </div>
      <div class="flex-1 text-center">
        <div class="flex items-center justify-center">
          <Icon icon="lucide:coins" class="mr-1" />
          <span>到账金额</span>
        </div>
        <div class="text-lg font-bold text-success">+{{ item.credits }}</div>
      </div>
    </div>

    <div class="p-3 text-sm">
      <div v-if="item.transactionId" class="flex items-start">
        <span class="text-muted-foreground shrink-0">交易流水号：</span>
        <span class="font-medium break-all">{{ item.transactionId }}</span>
      </div>
      <div v-if="item.comments" class="flex items-center">
        <span class="text-muted-foreground shrink-0">交易备注：</span>
        <span class="font-medium break-all">{{ item.comments }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">所属用户：</span>
        <a
          :href="`/users?uid=${item.userId}`"
          class="font-medium break-all underline"
        >
          {{ item.userId }}
        </a>
      </div>
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <span class="text-sm text-muted-foreground">
        {{ shop ? shop.shopName : '积分充值' }}
      </span>
      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
