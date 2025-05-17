<script setup lang="ts">
import type { ServiceGroup } from '@/inters/services'
import { deleteServiceGroup } from '@/api/services'
import { zServiceGroup } from '@/inters/services'
import { GROUP_STORE } from '../utils'

interface GroupActionProps {
  row: ServiceGroup
}

const props = defineProps<GroupActionProps>()

const router = useRouter()
const serviceStore = useServiceStore()

const store = inject(GROUP_STORE)!
const options = [
  { label: '查看服务', icon: 'lucide:eye', command: handleView },,
  { label: '删除', icon: 'lucide:trash', command: handleDelete },
]

function handleView() {
  router.push({
    path: '/service/items',
    query: {
      cid: props.row.categoryId,
    },
  })
}

function handleDelete() {
  if (!window.confirm('确定要删除该服务吗？')) return

  const id = props.row.categoryId
  deleteServiceGroup(id).then(() => {
    const idx = serviceStore.groups
      .findIndex(item => item.categoryId === id)

    serviceStore.groups.splice(idx, 1)
    store.visibleBase = false
  })
}

function handleUpdate() {
  store.formBase = zServiceGroup.parse(props.row)
  store.index = serviceStore.groups
    .findIndex(item => item.categoryId === props.row.categoryId)

  store.visibleBase = true
}
</script>

<template>
  <XButtonSplit
    :options="options"
    size="sm" label="编辑"
    @click="handleUpdate"
  />
</template>
