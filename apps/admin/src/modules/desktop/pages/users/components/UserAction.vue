<script setup lang="ts">
import type { User } from '@/inters/users'
import { zUserForm } from '@/inters/users'

import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/shared/confirm'
import { USER_STORE } from '../utils'
import { deleteUser } from '@/api/users'

interface UserActionProps {
  index: number
  row: User
}

const props = defineProps<UserActionProps>()

const options: XBtnSplitOptions = [
  { label: '查看详情', icon: 'lucide:eye' },
  { label: '积分设置', icon: 'lucide:dollar-sign' },,
  { label: '积分记录', icon: 'lucide:coins' },
  { label: '支付记录', icon: 'lucide:credit-card' },
  { label: '登录日志', icon: 'lucide:location-edit' },,
  { label: '永久删除', icon: 'lucide:trash-2', command: handleDelete },
]

const store = inject(USER_STORE)!

function openUpdate() {
  store.formBase = zUserForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该用户吗？')) return
  await deleteUser(props.row.userId)
  store.users.list.splice(props.index, 1)
  store.users.total--
}
</script>

<template>
  <XButtonSplit
    :options="options"
    size="sm" label="编辑"
    @click="openUpdate"
  />
</template>
