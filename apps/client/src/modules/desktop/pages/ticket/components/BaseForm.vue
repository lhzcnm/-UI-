<script setup lang="ts">
import type { TicketCreateForm } from '@/api/tickets'
import { TICKET_TYPE_LIST, TICKET_PRIORITY_LIST } from '@3un/shared/enums'

const form = defineModel<TicketCreateForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">工单类型</label>
      <XSelect v-model="form.type" width="336px">
        <XSelectItem
          v-for="item in TICKET_TYPE_LIST" :key="item.value"
          :value="item.value" :label="item.label"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">工单紧急程度</label>
      <XSelect v-model="form.priority" width="336px">
        <XSelectItem
          v-for="item in TICKET_PRIORITY_LIST" :key="item.value"
          :value="item.value" :label="item.label"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">工单主题</label>
      <XInput v-model="form.subject" placeholder="如：订单解锁失败" />
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">反馈内容</label>
      <XTextarea v-model="form.msg" rows="5" placeholder="订单号: 7890&#13;&#10;IMEI: 351234123412345" />
    </div>
  </form>
</template>
