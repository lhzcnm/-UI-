<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const operationOptions = [
  { label: t('profile.mobile.recharge.point'), icon: 'lucide:wallet', action: 'recharge' },
  { label: t('profile.mobile.recharge.recharge'), icon: 'lucide:shopping-cart', action: 'bill' },
  { label: t('profile.mobile.recharge.change'), icon: 'lucide:dollar-sign', action: 'credits' },
]
</script>

<template>
  <section class="mb-4 bg-card rounded-lg divide-y">
    <button
      v-for="option in operationOptions" :key="option.action"
      class="w-full flex items-center p-4 text-muted-foreground"
      @click="$router.push(`/m/${option.action}`)"
    >
      <Icon :icon="option.icon" class="size-5 mr-2" />
      <span class="flex-1 text-left">{{ option.label }}</span>
      <Icon icon="lucide:chevron-right" class="size-5" />
    </button>
  </section>
</template>
