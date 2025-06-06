<script setup lang="ts">
import type { TicketCreateForm } from '@/api/tickets'
import { TICKET_PRIORITY, TICKET_TYPE, TICKET_TYPE_LIST, TICKET_PRIORITY_LIST } from '@3un/utils'

const form = defineModel<TicketCreateForm>({ required: true })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">工单类型</label>
      <NativeSelect
        v-model="form.type"
        :options="TICKET_TYPE_LIST"
        :default="TICKET_TYPE.ORDER"
        value-key="value"
        label-key="label"
      />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">工单紧急程度</label>
      <NativeSelect
        v-model="form.priority"
        :options="TICKET_PRIORITY_LIST"
        :default="TICKET_PRIORITY.MEDIUM"
        value-key="value"
        label-key="label"
      />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">工单主题</label>
      <XInput v-model="form.subject" placeholder="如：订单解锁失败" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">反馈内容</label>
      <XTextarea v-model="form.msg" rows="5" placeholder="订单号: 7890&#13;&#10;IMEI: 351234123412345" />
    </div>
  </form>
</template>
