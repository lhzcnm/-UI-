<script setup lang="ts">
import { serviceApi, type Service, type ServiceDetail } from '@/api/services'
import type { XSelectEmits } from '@3un/ui'
import { Icon } from '@iconify/vue'

const store = useServiceStore()

const modal = defineModel<number>()
const emits = defineEmits<XSelectEmits>()
const favoriteIds = ref<number[]>()
const input = ref('')

const { t } = useI18n()

const filteredServices = computed(() => {
  const inputValue = input.value.trim().toLowerCase()

  if (!inputValue && favoriteIds.value?.length === 0) return store.details

  const services: ServiceDetail[] = []
  const favoriteChildren: Service[] = []

  for (const group of store.details) {
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

/** 收藏按钮的处理逻辑 */
async function favoriteClick(serviceId: number | null) {
  try {
    const res = await serviceApi.favorite(serviceId)
    favoriteIds.value = res.data
  } catch {
  }
}

onMounted(async () => {
  favoriteClick(null)
})

</script>

<template>
  <XSelect v-model="modal" v-model:input="input" v-bind="$attrs" filterable :placeholder="t('service.placeholder')"
    placement="bottom-start" @selected="emits('selected', $event)">
    <XSelectGroup v-for="detail in filteredServices" uiTitle="text-danger" :key="detail.id" :title="detail.title">
      <XSelectItem v-for="service in detail.children" :key="service.id" :value="service.id" :label="service.title"
        ui-root="py-1">
        <div class="flex-1 flex items-center justify-between space-x-3">
          <span class="text-left" v-html="getDisplayText(service)"></span>

          <div class="space-x-2 flex justify-center items-center" @click.stop="favoriteClick(service.id)">
            <span class="text-primary">￥{{ service.price }}</span>
            <Icon :icon="favoriteIds?.some(id => id === service.id) ? 'tabler:star-filled' : 'tabler:star'" 
              :class="favoriteIds?.some(id => id === service.id) ? 'text-yellow-500' : 'text-gray-400'"/>
            <!-- <Icon icon="tabler:star-filled" /> -->
          </div>
        </div>
      </XSelectItem>
    </XSelectGroup>
  </XSelect>
</template>
