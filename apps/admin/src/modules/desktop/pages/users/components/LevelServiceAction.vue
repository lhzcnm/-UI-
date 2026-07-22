<script setup lang="ts">
import { LEVEL_STORE } from '../utils'
import type { LevelService, LevelServiceUpdateParams } from '@/inters/level'
import { deleteLevelService, updateLevelService } from '@/api/level'
import { toast } from 'vue-sonner'

interface UserServiceActionProps {
  row: LevelService,
  index: number
}

const props = defineProps<UserServiceActionProps>()

const store = inject(LEVEL_STORE)!

async function handleDelete() {
  try {
    await deleteLevelService(props.row.id)
    store.services.splice(props.index, 1)
  } finally {}
}

async function handleUpdate() {
  const body: LevelServiceUpdateParams = {
    id: props.row.id,
    serviceId: props.row.packageId,
    planId: props.row.planId,
    price: props.row.price.toString(),
    freeCount: props.row.freeCount
  }

  await updateLevelService(body)
  toast.success("更新成功")
}
</script>

<template>
  <div class="flex gap-2">
    <XButton
      size="sm"
      label="更新"
      icon="lucide:edit"
      @click="handleUpdate"
    />
    <XButton
      size="sm"
      label="删除"
      color="danger"
      icon="lucide:trash-2"
      @click="handleDelete"
    />
  </div>
</template>
