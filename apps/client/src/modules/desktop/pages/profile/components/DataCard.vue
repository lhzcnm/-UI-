<script setup lang="ts">
const store = useUserStore()
const localStore = useLocalStore()

</script>

<template>
  <div class="border rounded-lg p-6 bg-card">
    <h3 class="text-lg mb-4">{{ localStore.localData['profile_StatTitle'] }}</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ localStore.localData['Available Balance'] }}
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
          <p class="text-success">{{ localStore.localData['profile_StatAmount'] }} {{ store.info.totalReceipts }}</p>
          <p class="text-warning">{{ localStore.localData['profile_StatLock'] }} {{ store.info.rechargeCount }}</p>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ localStore.localData['profile_StatOrder'] }}
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.userOrder.total"
          >
            {{ store.info.userOrder.total }}
          </data>
          <span class="text-sm text-muted-foreground">{{ localStore.localData['profile_StatPiece'] }}</span>
        </div>
        <div class="space-x-3 text-sm mt-2">
          <span class="text-success">{{ localStore.localData['profile_StatSuccess'] }} {{ store.info.userOrder.success }}</span>
          <span class="text-danger">{{ localStore.localData['profile_StatFail'] }} {{ store.info.userOrder.failed }}</span>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ localStore.localData['profile_StatMemberExpire	'] }}
        </div>
        <div>
          <data
            class="text-xl font-bold mr-1"
            :value="store.info.memberExp"
          >
            {{ store.info.memberExp || localStore.localData['profile_StatNotActivate']}}
          </data>
        </div>
        <RouterLink
          to="/recharge/membership"
          class="inline-block mt-3 text-sm text-primary"
        >
          {{ store.info.memberExp ? localStore.localData['profile_StatReNewal']: localStore.localData['profile_StatActivateNow'] }}
        </RouterLink>
      </div>
      <div class="border rounded-lg p-4">
        <div class="text-sm text-muted-foreground mb-3">
          {{ localStore.localData['profile_StatUseDay'] }}
        </div>
        <div>
          <data
            class="text-2xl font-bold mr-1"
            :value="store.info.usageDays"
          >
            {{ store.info.usageDays }}
          </data>
          <span class="text-sm text-muted-foreground">{{ localStore.localData['profile_StatDay'] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
