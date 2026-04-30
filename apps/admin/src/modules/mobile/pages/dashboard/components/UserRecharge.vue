<script setup lang="ts">
import dayjs from 'dayjs'
import { PAYMENT_METHOD_MAP, PAYMENT_STATUS_MAP } from '@3un/utils'

import { getTodayRecharge } from '@/api/dashboard'
import type { RechargeTodayList, RechargeTodayParams } from '@/inters/dashboard'
import { createList, getAvatar } from '@/utils'

const rechargeList = ref<RechargeTodayList>(createList())
const loading = ref<boolean>(false)
const page = ref(1)

watch(
  page,
  async (val) => await getRechargeList({
    page: val,
    pageSize: 50,
    startTime: dayjs().format('YYYY-MM-DD 00:00:00'),
    endTime: dayjs().format('YYYY-MM-DD 23:59:59'),
  }),
  { immediate: true }
)

async function getRechargeList(data: RechargeTodayParams) {
  try {
    loading.value = true
    rechargeList.value = await getTodayRecharge(data)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="border rounded overflow-hidden bg-card">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="text-lg font-bold">今日充值</h3>
      <XSimplePagination v-model="page" size="sm" :limit="50" :total="rechargeList.total" />
    </div>

    <div class="relative divide-y max-h-96 overflow-y-auto">
      <div v-show="loading" class="absolute w-full h-0.5 overflow-hidden bg-primary/10">
        <div class="h-full w-1/3 x-animation-slide rounded bg-primary" />
      </div>

      <div v-for="item in rechargeList.list" :key="item.paymentId" class="p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center flex-1 min-w-0 gap-2">
            <div class="flex items-center">
              <img :src="getAvatar(item.headImgUrl)" alt="Avatar" class="size-7 mr-2 border rounded">
              <div class="min-w-0 text-sm truncate space-y-1">
                <a :href="`/users?uid=${item.userId}`" class="underline hover:text-success">
                  {{ item.userId || `UID ${item.userId}` }}
                </a>
              </div>
            </div>
          </div>
          
          <div class="text-right text-sm flex items-center gap-2">
            <XTag :label="PAYMENT_METHOD_MAP[item.paymentMethod].label"
              :color="PAYMENT_METHOD_MAP[item.paymentMethod].color" />
  
            <XTag :label="PAYMENT_STATUS_MAP[item.paymentStatus].label"
              :color="PAYMENT_STATUS_MAP[item.paymentStatus].color" />
            <div class="font-semibold text-base text-primary">金额: ¥{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
