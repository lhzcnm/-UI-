<script setup lang="ts">
import { ACTIVITY_RECHARGE_STORE } from '../utils'
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { deleteRecharges } from '@/api/recharge'
import type { ActivyRecharge } from '@/inters/activity/recharge'
import { PAYMENT_STATUS_MAP } from "@3un/utils"
import { twJoin } from "tailwind-merge"

interface TheProps {
  item: ActivyRecharge,
  index: number
}

const props = defineProps<TheProps>()
const store = inject(ACTIVITY_RECHARGE_STORE)!
const item = props.item

async function handleDelete() {
  if (!await xconfirm('是否确认删除该记录')) return

  try {
    await deleteRecharges([item.paymentId])
    toast.success("删除成功")
    store.refresh = !store.refresh
  } catch {
    toast.error("删除失败")
  }
}
</script>

<template>
  <div class="bg-card border rounded-lg">
    <div class="flex items-center justify-between p-3">
      <h3>{{ item.paymentId }}</h3>
      <div class="flex items-center space-x-2">
        <XTag size="sm" v-bind="PAYMENT_STATUS_MAP[item.paymentStatus]" />
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
      <div class="flex-1 text-center">
        <div class="flex items-center justify-center">
          <Icon icon="lucide:coins" class="mr-1" />
          <span>赠送金额</span>
        </div>
        <div class="text-lg font-bold text-success">+{{ item.nonce }}</div>
      </div>
    </div>

    <div class="p-3 text-sm">
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

    <div class="flex items-center justify-end space-x-2 px-3 py-2 border-t border-dashed">
      <!-- <XButton
        label="生成积分券"
        size="sm"
      /> -->
      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
