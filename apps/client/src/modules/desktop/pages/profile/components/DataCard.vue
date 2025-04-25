<script setup lang="ts">
const store = useUserStore()
</script>

<template>
  <div class="border rounded-lg p-6 bg-card">
    <h3 class="text-lg mb-4">数据统计</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          可用余额
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.userOrder.total"
          >
            {{ store.info.credits }}
          </data>
          <span class="text-sm text-muted-foreground">￥</span>
        </div>
        <div class="space-x-3 text-sm mt-2">
          <span class="text-success">充值总额 {{ store.info.totalReceipts }}</span>
          <span class="text-warning">锁定积分 {{ store.info.rechargeCount }}</span>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          订单总数
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.userOrder.total"
          >
            {{ store.info.userOrder.total }}
          </data>
          <span class="text-sm text-muted-foreground">个</span>
        </div>
        <div class="space-x-3 text-sm mt-2">
          <span class="text-success">成功 {{ store.info.userOrder.success }}</span>
          <span class="text-danger">失败 {{ store.info.userOrder.failed }}</span>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          会员到期
        </div>
        <div>
          <data
            class="text-xl font-bold mr-1"
            :value="store.info.memberExp"
          >
            {{ store.info.memberExp || '未开通' }}
          </data>
        </div>
        <RouterLink
          to="/recharge/membership"
          class="inline-block mt-3 text-sm text-primary"
        >
          {{ store.info.memberExp ? '立即续费' : '立即开通' }}
        </RouterLink>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          使用天数
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.usageDays"
          >
            {{ store.info.usageDays }}
          </data>
          <span class="text-sm text-muted-foreground">天</span>
        </div>
      </div>
    </div>
  </div>
</template>
