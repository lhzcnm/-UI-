<script setup lang="ts">
import { serviceApi, type ServiceDetail, type ServiceView } from '@/api/services'

interface ServiceGroupVaulProps {
  group: ServiceDetail
}

const props = defineProps<ServiceGroupVaulProps>()
const visible = defineModel<boolean>({ default: false })

const router = useRouter()
const search = ref('')
const { t } = useI18n()

const filteredChildren = computed<ServiceView[]>(() => {
  if (!search.value) return props.group.children as ServiceView[]
  const val = search.value.trim().toLowerCase()
  const result: ServiceView[] = []

  for (const item of props.group.children) {
    const name = item.title
    const id = item.id.toString()
    const nameLower = name.toLowerCase()
    const isIdMatch = id.includes(val)
    const isNameMatch = nameLower.includes(val)

    if (isIdMatch || isNameMatch) {
      result.push({
        ...item,
        idHighlight: isIdMatch ? highlightText(id, val) : id,
        title: isNameMatch ? highlightText(name, val) : name,
      })
    }
  }

  return result
})

function highlightText(text: string, search: string): string {
  if (!search) return text
  const regex = new RegExp(`(${search})`, 'gi')
  return text.replace(regex, '<mark class="x-highlight">$1</mark>')
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-id]')

  if (!element) return

  const dataId = element.getAttribute('data-id')
  const id = parseInt(dataId || '0')

  router.push(`/m/submit/${id}`)
}


const favoriteIds= ref<number[]>()

async function favoriteClick(serviceId: number | undefined) {
  try {
    const res = await serviceApi.favorite(serviceId)
    favoriteIds.value = res.data
  } catch {
  }
}

onMounted(() =>{
  favoriteClick(undefined)
})
</script>

<template>
  <TheModal v-model="visible" :title="group.title" @close="search = ''">
    <XInput v-model="search" :placeholder="t('home.placeholder.service')" clearable ui-root="w-64 m-4 mt-0" />
    <div
      class="space-y-4 px-4 h-[calc(90vh-8.25rem)] overflow-y-auto"
      @click="handleClick"
    >
      <ServiceItemCard
        v-for="item in filteredChildren"
        :key="item.id" :data="item"
        :data-id="item.id"
        :favorite-ids="favoriteIds!"
      />
    </div>
  </TheModal>
</template>
