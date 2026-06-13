<script setup lang="ts">
import type { XSelectEmits } from '@3un/ui'
import { Icon } from '@iconify/vue'

import { serviceApi, type Service, type ServiceDetail } from '@/api/services'

interface SelectServiceProps {
  services: ServiceDetail[],
}

const props = defineProps<SelectServiceProps>()
const serviceId = defineModel<number>({ required: true })
const emits = defineEmits<XSelectEmits>()

const input = ref('')
const favoriteIds = ref<number[]>()

const localStore = useLocalStore()

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()

  if (!inputValue && favoriteIds.value?.length === 0) return props.services

  const services: ServiceDetail[] = []
  const favoriteChildren: Service[] = []

  for (const group of props.services) {
    const children: Service[] = []

    for (const service of group.children) {
      const matchesInput =
        !inputValue ||
        service.title.toLowerCase().includes(inputValue) ||
        service.id.toString().includes(inputValue)

      if (matchesInput) {
        children.push(service)
      }
      if (favoriteIds.value?.includes(service.id)) {
        favoriteChildren.push(service)
      }
    }

    if (children.length) {
      services.push({ ...group, children })
    }
  }
  
  if (favoriteChildren.length) {
    services.unshift({
      id: -1,
      title: '收藏服务',
      children: favoriteChildren
    })
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

async function favoriteService(id: number | undefined) {
  try {
    const { data } = await serviceApi.favorite(id)
    favoriteIds.value = data
  } catch {}
}

await favoriteService(undefined)
</script>

<template>
  <XSelect
    v-model="serviceId"
    v-model:input="input"
    v-bind="$attrs"
    filterable
    :placeholder="localStore.localData['print_CustomServiceSelect']"
    placement="bottom-start"
    @selected="emits('selected', $event)"
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

          <div class="space-x-2 flex justify-center items-center" @click.stop="favoriteService(service.id)">
            <span class="text-primary">￥{{ service.price }}</span>
            <Icon :icon="favoriteIds?.some(id => id === service.id) ? 'tabler:star-filled' : 'tabler:star'" 
              :class="favoriteIds?.some(id => id === service.id) ? 'text-yellow-500' : 'text-gray-400'"/>
          </div>
        </div>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
