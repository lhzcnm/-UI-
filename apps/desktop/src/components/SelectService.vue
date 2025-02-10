<script setup lang="ts">
import type { Service, ServiceDetail } from '@3un/shared/services'
import type { XSelectEmits } from '@3un/ui'

const store = useServiceStore()
await store.getServices()

const modal = defineModel<number>()
const emits = defineEmits<XSelectEmits>()
const input = ref('')

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()
  if (!inputValue) return store.serviceDetails

  const services: ServiceDetail[] = []
  for (const group of store.serviceDetails) {
    const children: Service[] = []

    for (const service of group.children) {
      if (
        service.name.toLowerCase().includes(inputValue) ||
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
  if (!keyword) return `${service.id} - ${service.name}`

  const idText = highlightText(service.id.toString(), keyword)
  const titleText = highlightText(service.name, keyword)
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
    v-model="modal"
    v-model:input="input"
    v-bind="$attrs"
    filterable
    placeholder="请选择服务"
    placement="bottom-start"
    @selected="emits('selected', $event)"
  >
    <XSelectGroup
      v-for="detail in filteredServices"
      :key="detail.id" :title="detail.name"
    >
      <XSelectItem
        v-for="service in detail.children" :key="service.id"
        active-class="border-l-[5px] border-blue-500 italic"
        :value="service.id" :label="service.name"
      >
        <span v-html="getDisplayText(service)"></span>
        <span>{{ service.price }}</span>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
