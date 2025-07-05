<script setup lang="ts">
import { xconfirm } from '@3un/utils'

import type { ServiceGroup } from '@/inters/services'
import { deleteServiceGroup } from '@/api/services'
import { zServiceGroup } from '@/inters/services'
import { GROUP_STORE } from '../utils'

interface TheProps {
  item: ServiceGroup
  index: number
}

const props = defineProps<TheProps>()

const serviceStore = useServiceStore()
const router = useRouter()

const store = inject(GROUP_STORE)!

const services = computed(() => {
  const id = props.item.categoryId
  return serviceStore.details
    .find(item => item.categoryId === id)
})

async function handleDelete() {
  if (!await xconfirm('确定要删除该服务吗？')) return

  const id = props.item.categoryId
  deleteServiceGroup(id).then(() => {
    serviceStore.groups.splice(props.index, 1)
  })
}

function handleClick() {
  store.formBase = zServiceGroup.parse(props.item)
  store.index = props.index
  store.visibleBase = true
}

function handleView() {
  router.push({
    path: '/service/items',
    query: {cid: props.item.categoryId},
  })
}
</script>

<template>
  <div
    class="bg-card rounded-lg border overflow-hidden"
    @click="handleClick"
  >
    <div class="p-3">
      <h3>{{ item.categoryId }} - {{ item.category }}</h3>
      <span class="text-sm text-muted-foreground">{{ item.categoryLocal }}</span>
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <span class="text-sm text-muted-foreground">服务数量 {{ services ? services.children.length : 0 }}</span>
      <div class="space-x-2">
        <XButton icon="lucide:trash" label="删除" size="sm" color="danger" @click.stop="handleDelete" />
        <XButton icon="lucide:eye" label="查看服务" size="sm" color="primary" @click.stop="handleView" />
      </div>
    </div>
  </div>
</template>
