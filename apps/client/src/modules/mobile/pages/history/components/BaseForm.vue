<script setup lang="ts">
import type { OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS } from '@3un/utils'

const form = defineModel<OrderSearchForm>({ required: true })
const serviceStore = useServiceStore()
const groupId = ref(0)

const options = computed(() => {
  const findIndex = serviceStore.details.findIndex(item =>
    item.id === groupId.value
  )

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})

const statusOptions = [
  { label: '全部', value: -1 },
  { label: '成功', value: ORDER_STATUS.SUCCESS },
  { label: '失败', value: ORDER_STATUS.FAILED },
  { label: '处理中', value: ORDER_STATUS.PROCESSING },
]
</script>

<template>
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-muted-foreground">服务选择：</label>
      <div class="flex items-center space-x-2">
        <NativeSelect
          v-model="groupId"
          :options="[...serviceStore.details]"
          @change="form.serviceId = 0"
          placeholder="请选择服务组"
          label-key="title"
          value-key="id"
        />
        <NativeSelect
          v-model="form.serviceId"
          :options="options"
          :disabled="!groupId"
          placeholder="请选择服务"
          label-key="title"
          value-key="id"
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm text-muted-foreground">订单状态：</label>
      <XSegmented
        v-model="form.status"
        :options="statusOptions"
        :default-value="-1"
      />
    </div>

    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-muted-foreground">提交时间：</label>
      <div class="flex items-center space-x-2">
        <NativeDate v-model="form.startTime" placeholder="开始时间" />
        <NativeDate v-model="form.endTime" placeholder="结束时间" />
      </div>
    </div>

    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-muted-foreground">IMEI/SN:</label>
      <XTextarea
        v-model="form.imei" rows="4"
        placeholder="IMEI/SN"
      />
    </div>
  </div>
</template>
