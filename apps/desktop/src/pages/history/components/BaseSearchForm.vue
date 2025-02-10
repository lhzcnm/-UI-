<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'

import type { OrderSearchForm } from '@3un/shared/orders'
import { ORDER_STATUS_LIST, ORDER_VERIFY_LIST } from '@3un/utils'
import { THEME } from '@3un/shared'

const theme = inject(THEME)!
const form = defineModel<OrderSearchForm>({ required: true })
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent>
    <div class="flex flex-col gap-1">
      <label class="text-muted-foreground text-xs">服务</label>
      <SelectService width="336px" v-model="form.serviceId" />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-muted-foreground text-xs">订单状态</label>
      <XSelect
        v-model="form.status"
        placeholder="请选择订单状态"
        width="336px"
      >
        <XSelectItem
          value="all" label="全部"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
      </XSelect>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-muted-foreground text-xs">订单验证状态</label>
      <XSelect
        v-model="form.verify"
        placeholder="请选择订单验证状态"
        width="336px"
      >
        <XSelectItem
          value="all" label="全部"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
        <XSelectItem
          v-for="item in ORDER_VERIFY_LIST" :key="item.value"
          :value="item.value" :label="item.label"
          active-class="bg-blue-500 text-zinc-100 rounded"
        />
      </XSelect>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-muted-foreground text-xs">日期</label>
      <VueDatePicker
        v-model="form.date"
        locale="zh-cn" range teleport-center
        :day-names="['一', '二', '三', '四', '五', '六', '日']"
        :enable-time-picker="false"
        :dark="theme.isDark"
        placeholder="请选择日期"
        cancel-text="取消"
        select-text="确定"
      />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-muted-foreground text-xs">IMEI/SN</label>
      <XTextarea
        v-model="form.imei"
        placeholder="请输入IMEI/SN"
        rows="8"
      />
    </div>
  </form>
</template>
