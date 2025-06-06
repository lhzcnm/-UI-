<script setup lang="ts">
import type { TicketCreateForm, TicketType } from '@/api/tickets'
import { TICKET_PRIORITY_LIST } from '@3un/utils'

interface BaseFormProps {
  typeList: TicketType[]
}

const props = defineProps<BaseFormProps>()
const form = defineModel<TicketCreateForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">工单类型</label>
      <XSelect v-model="form.type">
        <XSelectItem
          v-for="item in props.typeList" :key="item.departmentId"
          :value="item.departmentId" :label="item.departmentName"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">工单紧急程度</label>
      <XSelect v-model="form.priority">
        <XSelectItem
          v-for="item in TICKET_PRIORITY_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
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
