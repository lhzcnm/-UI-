<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { ORDER_STATUS_LIST } from '@3un/utils'
import { STORE, type OrderEditStore } from '../utils'

const store: OrderEditStore = inject(STORE)!
const serviceStore = useServiceStore()

function getServiceTitle(serviceId: number) {
  const item = serviceStore.itemMap.get(serviceId)
  return item ? item.packageTitle : '未知服务'
}

const form = reactive({
  status: null,
  code: null,
})

function unitApply() {
  store.items.forEach(item => {
    if (form.status) item.status = form.status
    if (form.code) item.code = form.code
  })

  form.status = null
  form.code = null
}
</script>

<template>
  <section class="px-6 pb-6 flex-1 space-y-3">
    <div class="flex items-center space-x-3 border rounded-md p-4">
      <span class="flex-shrink-0 font-bold">批量修改：</span>
      <XSelect
        v-model="form.status"
        placeholder="请选择订单状态"
        ui-trigger="w-64"
        clearable
      >
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
      <XInput v-model="form.code" placeholder="订单结果" ui-root="w-64" clearable />
      <XButton label="应用" @click="unitApply" />
    </div>

    <div
      v-for="(item, index) in store.items" :key="index"
      class="flex items-start space-x-3 border rounded-md p-4"
    >
      <div class="w-72">
        <div class="text-lg font-bold flex items-center space-x-2">
          <span
            :class="twJoin(
              'flex items-center justify-center text-sm px-2',
              'bg-primary text-white rounded-full min-w-6 h-6',
            )"
          >
            {{ index + 1 }}
          </span>
          <span>{{ item.imei }}</span>
        </div>
        <span class="text-sm text-muted-foreground">
          {{ getServiceTitle(item.serviceId) }}
        </span>
      </div>
      <div>
        <label class="inline-block text-label text-sm mb-1">订单状态：</label>
        <XSelect v-model="item.status" placeholder="请选择订单状态" ui-trigger="w-64">
          <XSelectItem
            v-for="item in ORDER_STATUS_LIST" :key="item.value"
            :value="item.value" :label="item.label"
          />
        </XSelect>
      </div>
      <div class="flex-1 space-y-3">
        <div class="flex items-center">
          <label class="inline-block w-32 text-label text-sm text-right">上游订单号：</label>
          <XInput v-model="item.serverOrderId" placeholder="上游订单号（可选，不填则不修改）" />
        </div>
        <div class="flex items-start">
          <label class="inline-block w-32 text-label text-sm text-right">订单结果：</label>
          <XTextarea v-model="item.code" placeholder="订单结果（可选，不填则不修改）" rows="6" />
        </div>
      </div>
    </div>
  </section>
</template>
