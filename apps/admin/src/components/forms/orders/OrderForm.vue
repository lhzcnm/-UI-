<script setup lang="ts">
import type { OrderUpdateForm } from '@/inters/orders'
import { XSelectItem } from '@3un/ui';
import { ORDER_STATUS_LIST } from '@3un/utils'

const form = defineModel<OrderUpdateForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-muted-foreground mb-1">IMEI/SN</label>
      <XInput v-model="form.imeiNo" />
    </div>
    <div>
      <label class="block text-sm text-muted-foreground mb-1">订单状态</label>
      <XSelect v-model="form.codeStatusId">
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
    </div>
    <div>
      <label class="block text-sm text-muted-foreground mb-1">订单结果</label>
      <XTextarea v-model="form.code" placeholder="订单结果" />
    </div>
    <div>
      <label class="block text-sm text-muted-foreground mb-1">上游订单信息</label>
      <XInput v-model="form.messageFromServer" />
    </div>
    <div>
      <label class="block text-sm text-muted-foreground mb-1">上游订单号</label>
      <XInput v-model="form.orderIdFromServer" />
    </div>
  </form>
</template>
