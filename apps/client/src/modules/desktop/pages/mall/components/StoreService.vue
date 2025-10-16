<script setup lang="ts">
import type { GroupOption, ServiceOption } from '../api/types'

interface StoreServiceProps {
  groups: GroupOption[],
  services: ServiceOption[],
}

defineProps<StoreServiceProps>()
const groupId = defineModel<number>('group', { required: true })
const serviceId = defineModel<number>('service', { required: true })

const { t } = useI18n()
</script>

<template>
  <section class="flex space-x-2">
    <XSelect
      ui-trigger="w-48"
      :placeholder="t('serviceGroup.placeholder')"
      v-model="groupId"
      @selected="serviceId = -1">
      <XSelectItem
        :value="-1" :label="t('serviceGroup.placeholder')" />
      <XSelectItem
        v-for="group in groups" :key="group.id"
        :value="group.id" :label="group.title"
      />
    </XSelect>
    <XSelect
      ui-trigger="w-64"
      :placeholder="t('service.placeholder')"
      v-model="serviceId"
      :disabled="groupId === -1">
      <XSelectItem
        :value="-1" :label="t('service.placeholder')" />
      <XSelectItem
        v-for="service in services" :key="service.serviceId"
        :value="service.serviceId" :label="service.name"
      />
    </XSelect>
  </section>
</template>
