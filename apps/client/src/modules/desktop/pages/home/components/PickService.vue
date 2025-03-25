<script setup lang="ts">
import type { ServiceDetail, ServiceView } from '@/api/services'

interface ServiceGroupDialogProps {
  group: ServiceDetail
}

const props = defineProps<ServiceGroupDialogProps>()
const visible = defineModel<boolean>({ required: true })

const router = useRouter()
const search = ref('')

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

  router.push(`/submit/${id}`)
}
</script>

<template>
  <XDialog
    v-model="visible" title="服务列表"
    contentClass="sm:max-w-screen-md"
    @close="search = ''"
  >
    <div class="space-y-4">
      <XInput v-model="search" placeholder="搜索服务" class="w-64" autofocus />
      <div class="h-[min(calc(100vh-240px),600px)] overflow-y-auto" type="auto">
        <div
          class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] pr-1"
          @click="handleClick"
        >
          <ServiceItemCard
            v-for="item in filteredChildren"
            :key="item.id" :data="item"
            :data-id="item.id"
          />
        </div>
      </div>
    </div>
  </XDialog>
</template>
