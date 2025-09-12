<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = useUserStore()
const visibleInfo = defineModel<boolean>({ required: true })

const { t } = useI18n()

const order = store.info.userOrder
const accountStats = [
  { label: t('profile.mobile.balance'), value: store.info.credits },
  { label: t('profile.mobile.order'), value: order.total },
  { label: t('profile.mobile.handle'), value: order.total - order.success - order.failed },
]
</script>

<template>
  <section class="mb-3 p-4 bg-card rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-medium">{{ t('profile.mobile.title.account') }}</h3>
      <button
        class="flex-1 flex items-center justify-end space-x-1 text-sm text-muted-foreground"
        @click="visibleInfo = true"
      >
        {{ t('profile.mobile.text.detail') }} <Icon icon="lucide:chevron-right" class="size-4" />
      </button>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="stat in accountStats"
        :key="stat.label"
        class="text-center"
      >
        <div class="text-lg font-medium mb-1">{{ stat.value }}</div>
        <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
      </div>
    </div>
    <div class="flex space-x-2 mt-4">
      <XButton
        class="w-full" icon="lucide:dollar-sign"
        variant="soft" color="danger"
        @click="$router.push('/m/credits')"
      >
        {{ t('profile.mobile.button.bill') }}
      </XButton>
      <XButton
        class="w-full" icon="lucide:wallet"
        @click="$router.push('/m/recharge')"
      >
        {{ t('profile.mobile.button.recharge') }}
      </XButton>
    </div>
  </section>
</template>
