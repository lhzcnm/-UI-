<script setup lang="ts">
import type { ClassNameValue } from 'tailwind-merge'

import type { Service, ServiceDetail } from '@/inters/services'

interface SelServiceProps {
  services: ServiceDetail[],
  class: ClassNameValue,
}

const props = defineProps<SelServiceProps>()

const serviceId = defineModel<number>({ required: true })

const input = ref('')

const { t } = useI18n()

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()
  if (!inputValue) return props.services

  const services: ServiceDetail[] = []
  for (const group of props.services) {
    const children: Service[] = []

    for (const service of group.children) {
      if (
        service.title.toLowerCase().includes(inputValue) ||
        service.id.toString().includes(inputValue)
      ) {
        children.push(service)
      }
    }

    if (children.length) {
      services.push({ ...group, children })
    }
  }

  return services
})

function getDisplayText(service: Service) {
  const keyword = input.value.trim()
  if (!keyword) return `${service.id} - ${service.title}`

  const idText = highlightText(service.id.toString(), keyword)
  const titleText = highlightText(service.title, keyword)
  return `${idText} - ${titleText}`
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim()) return text
  const reg = new RegExp(`(${keyword})`, 'gi')
  return text.replace(reg, '<mark class="x-highlight">$1</mark>')
}
</script>

<template>
  <XSelect
    :ui-trigger="props.class"
    v-model="serviceId"
    v-model:input="input"
    v-bind="$attrs"
    filterable
    clearable
    :placeholder="t('service.placeholder')"
    placement="bottom-start"
  >
    <XSelectGroup
      v-for="detail in filteredServices" uiTitle="text-danger"
      :key="detail.id" :title="detail.title"
    >
      <XSelectItem
        v-for="service in detail.children" :key="service.id"
        :value="service.id" :label="service.title"
        ui-root="py-1"
      >
        <div class="flex-1 flex items-center justify-between space-x-3">
          <span class="text-left" v-html="getDisplayText(service)"></span>
          <span class="text-primary">￥{{ service.price }}</span>
        </div>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
