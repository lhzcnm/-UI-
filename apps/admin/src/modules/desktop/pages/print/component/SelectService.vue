<script setup lang="ts">
import type { Service, ServiceDetail } from '@/inters/services'
import type { XSelectEmits, XSelectProps } from '@3un/ui'

interface SelectServiceProps {
  services: ServiceDetail[]
  selectProps: XSelectProps
}

const props = defineProps<SelectServiceProps>()

// const store = useServiceStore()

const modal = defineModel<number>()
const emits = defineEmits<XSelectEmits>()

const input = ref('')

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()
  if (!inputValue) return props.services

  const services: ServiceDetail[] = []
  for (const group of props.services) {
    const children: Service[] = []

    for (const service of group.children) {
      if (
        service.packageTitle.toLowerCase().includes(inputValue) ||
        service.packageId.toString().includes(inputValue)
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
  if (!keyword) return `${service.packageId} - ${service.packageTitle}`

  const idText = highlightText(service.packageId.toString(), keyword)
  const titleText = highlightText(service.packageTitle, keyword)
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
    v-model.number="modal"
    v-model:input="input"
    v-bind="{...props.selectProps, ...$attrs}"

    filterable
    placement="bottom-start"
    placeholder="请选择服务"
    @selected="emits('selected', $event)"
  >
    <XSelectGroup
      v-for="detail in filteredServices"
      :key="detail.categoryId" :title="detail.category"
    >
      <XSelectItem
        v-for="service in detail.children" :key="service.packageId"
        :value="service.packageId" :label="service.packageTitle"
        ui-root="py-1"
      >
        <div class="flex-1 flex items-center justify-between space-x-3">
          <span class="text-left" v-html="getDisplayText(service)"></span>
          <span class="text-primary">￥{{ service.packagePrice }}</span>
        </div>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
