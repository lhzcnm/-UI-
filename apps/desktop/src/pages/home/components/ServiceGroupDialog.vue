<script setup lang="ts">
import type { ServiceDetail, Service } from '@3un/shared/services'
import ServiceItemCard from './ServiceItemCard.vue'

interface ServiceGroupDialogProps {
  group: ServiceDetail
}

const props = defineProps<ServiceGroupDialogProps>()
const visible = defineModel<boolean>({ required: true })

const search = ref('')

const filteredChildren = computed<Service[]>(() => {
  if (!search.value) return props.group.children
  const val = search.value.trim().toLowerCase()
  const result: Service[] = []

  for (const item of props.group.children) {
    const name = item.name
    const id = item.id.toString()
    const nameLower = name.toLowerCase()
    const isMatch = nameLower.includes(val) || id.includes(val)

    if (isMatch) {
      result.push({
        ...item,
        id: highlightText(id, val) as any,
        name: highlightText(name, val),
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
</script>

<template>
  <XDialog
    v-model="visible" title="服务列表"
    contentClass="sm:max-w-screen-md"
    @close="search = ''"
  >
    <div class="flex flex-col gap-4">
      <XInput v-model="search" placeholder="搜索服务" class="w-64" autofocus />

      <div class="h-[min(calc(100vh-240px),600px)] overflow-y-auto" type="auto">
        <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] pr-1">
          <ServiceItemCard
            v-for="item in filteredChildren"
            :key="item.id"
            :data="item"
          />
        </div>
      </div>
    </div>
  </XDialog>
</template>
