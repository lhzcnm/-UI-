<script setup lang="ts">
import type { UserService, UserServiceUpdateParams } from '@/inters/users'
import { USER_STORE } from '../utils'
import { deleteUserService, updateUserService } from '@/api/users'
import { toast } from 'vue-sonner'

interface UserServiceActionProps {
  row: UserService,
  index: number
}

const props = defineProps<UserServiceActionProps>()

const store = inject(USER_STORE)!

async function handleDelete() {
  try {
    await deleteUserService([props.row.id])
    store.services.splice(props.index, 1)
  } finally {}
}

async function handleUpdate() {
  const body: UserServiceUpdateParams = {
    id: props.row.id,
    userId: store.users.list[props.index].userId,
    packageId: props.row.packageId,
    price: props.row.price
  }

  await updateUserService(body)
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
