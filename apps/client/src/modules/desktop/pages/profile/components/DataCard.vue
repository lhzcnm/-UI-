<script setup lang="ts">
const store = useUserStore()
const { t } = useI18n()
</script>

<template>
  <div class="border rounded-lg p-6 bg-card">
    <h3 class="text-lg mb-4">{{ t('profile.stat.title') }}</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ t('profile.stat.balance') }}
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
        <div class="space-y-1 text-sm mt-2">
          <p class="text-success">{{ t('profile.stat.amount') }} {{ store.info.totalReceipts }}</p>
          <p class="text-warning">{{ t('profile.stat.lock') }} {{ store.info.rechargeCount }}</p>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ t('profile.stat.order') }}
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.userOrder.total"
          >
            {{ store.info.userOrder.total }}
          </data>
          <span class="text-sm text-muted-foreground">{{ t('profile.stat.piece') }}</span>
        </div>
        <div class="space-x-3 text-sm mt-2">
          <span class="text-success">{{ t('profile.stat.success') }} {{ store.info.userOrder.success }}</span>
          <span class="text-danger">{{ t('profile.stat.fail') }} {{ store.info.userOrder.failed }}</span>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ t('profile.stat.memberExpire') }}
        </div>
        <div>
          <data
            class="text-xl font-bold mr-1"
            :value="store.info.memberExp"
          >
            {{ store.info.memberExp || t('profile.stat.notActivate') }}
          </data>
        </div>
        <RouterLink
          to="/recharge/membership"
          class="inline-block mt-3 text-sm text-primary"
        >
          {{ store.info.memberExp ? t('profile.stat.reNewal') : t('profile.stat.activateNow') }}
        </RouterLink>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ t('profile.stat.useDay') }}
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.usageDays"
          >
            {{ store.info.usageDays }}
          </data>
          <span class="text-sm text-muted-foreground">{{ t('profile.stat.day') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
