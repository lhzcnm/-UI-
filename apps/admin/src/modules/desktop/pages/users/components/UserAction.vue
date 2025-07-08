<script setup lang="ts">
import type { User } from '@/inters/users'
import { zUserForm, zUserPointForm, zUserServiceForm } from '@/inters/users'
import { deleteUser, getUserServices, getExtraInfo } from '@/api/users'

import type { XBtnSplitOptions } from '@3un/ui'
import { PAYMENT_METHOD, USER_ROLE, xconfirm } from '@3un/utils'

import { USER_STORE } from '../utils'

interface UserActionProps {
  index: number
  row: User
}

const props = defineProps<UserActionProps>()

const options: XBtnSplitOptions = [
  { label: '查看详情', icon: 'lucide:eye', command: openDetail },
  { label: '积分设置', icon: 'lucide:dollar-sign', command: openPoint },
  { label: '服务设置', icon: 'lucide:server', command: openService },,
  { label: '订单历史', icon: 'lucide:shopping-cart', command: toOrderHistory },
  { label: '积分记录', icon: 'lucide:coins', command: toCredits },
  { label: '充值记录', icon: 'lucide:credit-card', command: toRecharge },
  { label: '登录日志', icon: 'lucide:location-edit', command: toLoginLogs },,
  { label: '永久删除', icon: 'lucide:trash-2', command: handleDelete },
]

const store = inject(USER_STORE)!
const router = useRouter()

function openUpdate() {
  store.formBase = zUserForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function openDetail() {
  const userId = props.row.userId
  const extraInfo = await getExtraInfo(userId)
  store.extraInfo = extraInfo

  store.index = props.index
  store.visibleDetail = true
}

function openPoint() {
  store.formPoint = zUserPointForm.parse({
    paymentMethod: PAYMENT_METHOD.ADMIN,
    userId: props.row.userId,
    isAdd: true,
    isPay: false,
    credits: 0,
    transactionId: '',
    comments: '',
  })

  store.index = props.index
  store.visiblePoint = true
}

async function openService() {
  await getServices()

  store.formService = zUserServiceForm.parse({
    userId: props.row.userId,
  })

  store.index = props.index
  store.visibleService = true
}

async function getServices() {
  const userId = props.row.userId
  const response = await getUserServices(userId)
  store.services = response
}

function toRecharge() {
  const uid = props.row.userId
  router.push({
    name: 'Recharge',
    query: { uid },
  })
}

function toOrderHistory() {
  const uid = props.row.userId
  router.push({
    name: 'Orders',
    query: { uid },
  })
}

function toCredits() {
  const uid = props.row.userId
  router.push({
    name: 'Credits',
    query: { uid },
  })
}

function toLoginLogs() {
  const { userId, role } = props.row
  const isUser = role === USER_ROLE.USER
  const q = isUser ? undefined : 'admin'

  router.push({
    name: 'Logs',
    query: { uid: userId, q },
  })
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
