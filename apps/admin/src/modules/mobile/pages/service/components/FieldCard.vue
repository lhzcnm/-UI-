<script setup lang="ts">
import { xconfirm } from '@3un/utils'

import type { ServiceField } from '@/inters/services'
import { zServiceFieldForm } from '@/inters/services'
import { deleteServiceField } from '@/api/services'
import { FIELD_STORE } from '../utils'

interface TheProps {
  item: ServiceField
  index: number
}

const props = defineProps<TheProps>()
const serviceStore = useServiceStore()
const store = inject(FIELD_STORE)!

function openUpdate() {
  store.formBase = zServiceFieldForm.parse(props.item)
  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该字段吗？')) return

  deleteServiceField([props.item.id]).then(() => {
    store.fields.list.splice(props.index, 1)
    store.fields.total--
  })
}

const service = computed(() =>
  serviceStore.itemMap.get(props.item.serviceId)
)
</script>

<template>
  <div
    class="bg-card rounded-lg border overflow-hidden"
    @click="openUpdate"
  >
    <div class="p-3">
      <div class="flex items-center justify-between">
        <h3>{{ item.id }}|{{ item.name }}</h3>
        <XTag :label="item.status ? '显示' : '隐藏'" color="success" size="sm" />


      </div>
      <span class="text-sm text-muted-foreground">
        {{ service ? service.packageTitle : '服务不存在' }}
      </span>
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <span class="text-sm text-muted-foreground">
        字段宽度 {{ item.width }}
      </span>

      <XButton
        color="danger"
        icon="lucide:trash"
        label="删除" size="sm"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
