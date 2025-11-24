<script setup lang="ts">
import type { ClassNameValue } from 'tailwind-merge'

import type { Service, ServiceDetail } from '@/inters/services'

interface SelectServiceProps {
  services: ServiceDetail[],
  class?: ClassNameValue,
}

const props = defineProps<SelectServiceProps>()

const serviceId = defineModel<number>()

const keyword = ref<string>("")

const filteredServices = computed(() => {
  const inputValue = keyword.value.trim().toLowerCase()
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
  const input = keyword.value.trim()
  if (!keyword) return `${service.id} - ${service.title}`

  const idText = highlightText(service.id.toString(), input)
  const titleText = highlightText(service.title, input)
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
    v-model="serviceId"
    v-model:input="keyword"
    :ui-trigger="props.class"
    filterable
    clearable
  >
    <XSelectGroup
      v-for="group in filteredServices" :key="group.id"
      :title="group.title" ui-title="text-danger"
    >
      <XSelectItem
        v-for="service in group.children" :key="service.id"
        :value="service.id" :label="service.title"
      >
        <div class="flex-1 flex items-center justify-between space-x-3">
          <span class="text-left" v-html="getDisplayText(service)"></span>
          <span class="text-primary">￥{{ service.price }}</span>
        </div>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
