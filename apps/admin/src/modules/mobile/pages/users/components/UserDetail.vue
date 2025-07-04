<script setup lang="ts">
import type { XTagProps } from '@3un/ui'
import { PAYMENT_METHOD, xconfirm, USER_ROLE_MAP, USER_ROLE } from '@3un/utils'
import { Icon } from '@iconify/vue'

import { zUserForm, zUserPointForm, zUserServiceForm } from '@/inters/users'
import { deleteUser, getUserServices } from '@/api/users'
import { USER_STORE } from '../utils'

const levelStore = useLevelStore()
const router = useRouter()
const store = inject(USER_STORE)!

const extraInfo = computed(() => store.extraInfo)
const user = computed(() => store.users.list[store.index!])
const level = computed(() => levelStore.levelMap.get(user.value.pricePlanId!))

const headImgUrl = computed(() => {
  if (user.value.headImgUrl) {
    return user.value.headImgUrl
  }
  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
})

const status = computed<XTagProps>(() => {
  const label = user.value.disableUser ? '已禁用' : '正常'
  const color = user.value.disableUser ? 'danger' : 'success'
  return { label, color }
})

function openUpdate() {
  store.formBase = zUserForm.parse(user.value)
  store.visibleBase = true
}

function openPoint() {
  store.formPoint = zUserPointForm.parse({
    paymentMethod: PAYMENT_METHOD.ADMIN,
    userId: user.value.userId,
    isAdd: true,
    isPay: false,
    credits: 0,
    transactionId: '',
    comments: '',
  })

  store.index = store.index
  store.visiblePoint = true
}

async function openService() {
  await getServices()

  store.formService = zUserServiceForm.parse({
    userId: user.value.userId,
  })

  store.index = store.index
  store.visibleService = true
}

async function getServices() {
  const userId = user.value.userId
  const response = await getUserServices(userId)
  store.services = response
}

function toRecharge() {
  const uid = user.value.userId
  router.push({
    name: 'Recharge',
    query: { uid },
  })
}

function toCredits() {
  const uid = user.value.userId
  router.push({
    name: 'Credits',
    query: { uid },
  })
}

function toLoginLogs() {
  const { userId, role } = user.value
  const isUser = role === USER_ROLE.USER
  const q = isUser ? undefined : 'admin'

  router.push({
    name: 'Logs',
    query: { uid: userId, q },
  })
}

async function handleDelete() {
  if (!await xconfirm('确定删除该用户吗？')) return  
  await deleteUser(user.value.userId)
  store.users.list.splice(store.index!, 1)
  store.users.total--
  store.visibleDetail = false
}
</script>

<template>
  <SlideRight
    v-model="store.visibleDetail"
    title="用户详情"
  >
    <div class="flex items-center space-x-4 p-4 border-b">
      <img :src="headImgUrl" class="size-12 rounded-full border-2" />
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-semibold truncate">
          {{ user.nickName || user.userName }}
        </h2>
        <div class="text-sm text-muted-foreground">
          <span>ID: {{ user.userId }}</span><span>•</span>
          <span>{{ USER_ROLE_MAP[user.role].label }}</span>
        </div>
      </div>
      <div class="flex items-center bg-success text-white px-3 py-1 rounded-full">
        <Icon icon="lucide:credit-card" class="size-4 mr-1" />
        <span class="font-bold text-sm">{{ user.credits }}</span>
      </div>
    </div>

    <div class="p-4 border-b">
      <div class="flex items-center mb-3">
        <Icon icon="lucide:bar-chart-3" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">账户统计</h3>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-muted rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">累计充值</div>
          <div class="text-lg font-bold text-foreground">{{ extraInfo.totalCredit }}</div>
        </div>
        <div class="bg-muted rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">消费积分</div>
          <div class="text-lg font-bold text-foreground">{{ extraInfo.consumeCredit }}</div>
        </div>
        <div class="bg-muted rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">未付积分</div>
          <div class="text-lg font-bold text-orange-600">{{ extraInfo.unpaidCredit }}</div>
        </div>
        <div class="bg-muted rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">锁定积分</div>
          <div class="text-lg font-bold text-red-600">{{ extraInfo.lockedCredit }}</div>
        </div>
      </div>
    </div>

    <div class="p-4 border-b">
      <div class="flex items-center mb-2">
        <Icon icon="lucide:shopping-cart" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">订单统计</h3>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-muted rounded-lg p-2 text-center">
          <div class="text-xs text-muted-foreground mb-1">总订单</div>
          <div class="text-lg font-bold text-primary">{{ extraInfo.totalCode }}</div>
        </div>
        <div class="bg-muted rounded-lg p-2 text-center">
          <div class="text-xs text-muted-foreground mb-1">成功订单</div>
          <div class="text-lg font-bold text-success">{{ extraInfo.successCode }}</div>
        </div>
        <div class="bg-muted rounded-lg p-2 text-center">
          <div class="text-xs text-muted-foreground mb-1">其他订单</div>
          <div class="text-lg font-bold text-warning">
            {{ extraInfo.totalCode - extraInfo.successCode }}
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-b border-dashed">
      <div class="flex items-center mb-3">
        <Icon icon="lucide:settings" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">便捷操作</h3>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <XButton class="rounded-full" size="md" color="success" icon="lucide:credit-card" label="积分设置" @click="openPoint" />
        <XButton class="rounded-full" icon="lucide:server" label="服务设置" @click="openService" />
      </div>
    </div>
    <div class="p-4 border-b">
      <div class="grid grid-cols-3 gap-2">
        <XButton class="rounded-full" variant="soft" color="warning" icon="lucide:credit-card" label="充值记录" @click="toRecharge" />
        <XButton class="rounded-full" variant="soft" icon="lucide:credit-card" label="消费记录" @click="toCredits" />
        <XButton class="rounded-full" variant="soft" color="warning" icon="lucide:log-in" label="登录日志" @click="toLoginLogs" />
      </div>
    </div>

    <div class="p-4 pb-0">
      <div class="flex items-center">
        <Icon icon="lucide:user" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">详细信息</h3>
      </div>
      <div class="divide-y">
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">登录账号</span>
          <span class="text-sm font-medium">{{ user.userName }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">微信ID</span>
          <span class="text-sm font-medium">{{ user.weiXinOpenid || '未绑定' }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">手机号</span>
          <span class="text-sm font-medium">{{ user.phone || '未绑定' }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">邮箱</span>
          <span class="text-sm font-medium">{{ user.userEmail || '未绑定' }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">注册时间</span>
          <span class="text-sm font-medium">{{ user.addedAt }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">会员等级</span>
          <span class="text-sm font-medium">{{ level ? level.pricePlan : '未知' }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">会员到期</span>
          <span class="text-sm font-medium">{{ user.memberExp || '未开通' }}</span>
        </div>
        <div class="flex justify-between items-center py-3">
          <span class="text-sm text-muted-foreground">状态</span>
          <XTag :color="status.color" :label="status.label" />
        </div>
      </div>
    </div>

    <div class="flex space-x-3 bg-background p-4">
      <XButton
        label="删除"
        class="flex-1"
        color="danger"
        icon="lucide:trash-2"
        @click="handleDelete"
      />
      <XButton
        label="编辑"
        class="flex-1"
        icon="lucide:edit"
        @click="openUpdate"
      />
    </div>
  </SlideRight>
</template>
