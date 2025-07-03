<script setup lang="ts">
import { xconfirm } from '@3un/utils'
import { Icon } from '@iconify/vue'
import type { XTagProps } from '@3un/ui'
import { USER_ROLE_MAP } from '@3un/utils'

import { zUserForm } from '@/inters/users'
import { deleteUser } from '@/api/users'
import { USER_STORE } from '../utils'

const levelStore = useLevelStore()
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
    <!-- 用户基本信息 -->
    <div class="p-4 border-b bg-background">
      <div class="flex items-start space-x-4">
        <img :src="headImgUrl" class="size-16 rounded-full border-2 border-gray-200" />
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-semibold text-foreground truncate">
            {{ user.nickName || user.userName }}
          </h2>
          <div class="flex items-center mt-1 text-sm text-muted-foreground">
            <span>ID: {{ user.userId }}</span>
            <span class="mx-2">•</span>
            <span>{{ USER_ROLE_MAP[user.role].label }}</span>
          </div>
          <div class="flex items-center mt-2">
            <XTag
              :color="status.color"
              :label="status.label"
              size="sm"
            />
          </div>
        </div>
        <div class="flex items-center bg-success text-white px-3 py-1 rounded-full">
          <Icon icon="lucide:credit-card" class="size-4 mr-1" />
          <span class="font-bold text-sm">{{ user.credits }}</span>
        </div>
      </div>
    </div>

    <!-- 账户统计 -->
    <div class="p-4 border-b">
      <div class="flex items-center mb-3">
        <Icon icon="lucide:bar-chart-3" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">账户统计</h3>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">累计充值</div>
          <div class="text-lg font-bold text-foreground">{{ extraInfo.totalCredit }}</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">消费积分</div>
          <div class="text-lg font-bold text-foreground">{{ extraInfo.consumeCredit }}</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">未付积分</div>
          <div class="text-lg font-bold text-orange-600">{{ extraInfo.unpaidCredit }}</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-muted-foreground mb-1">锁定积分</div>
          <div class="text-lg font-bold text-red-600">{{ extraInfo.lockedCredit }}</div>
        </div>
      </div>
    </div>

    <!-- 订单统计 -->
    <div class="p-4 border-b">
      <div class="flex items-center mb-3">
        <Icon icon="lucide:shopping-cart" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">订单统计</h3>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-blue-50 rounded-lg p-3 text-center">
          <div class="text-xs text-muted-foreground mb-1">总订单</div>
          <div class="text-lg font-bold text-blue-600">{{ extraInfo.totalCode }}</div>
        </div>
        <div class="bg-green-50 rounded-lg p-3 text-center">
          <div class="text-xs text-muted-foreground mb-1">成功订单</div>
          <div class="text-lg font-bold text-green-600">{{ extraInfo.successCode }}</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-center">
          <div class="text-xs text-muted-foreground mb-1">其他订单</div>
          <div class="text-lg font-bold text-gray-600">{{ extraInfo.totalCode - extraInfo.successCode }}</div>
        </div>
      </div>
    </div>

    <!-- 详细信息 -->
    <div class="p-4">
      <div class="flex items-center mb-3">
        <Icon icon="lucide:user" class="size-5 mr-2 text-primary" />
        <h3 class="font-semibold text-foreground">详细信息</h3>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <!-- 基本信息 -->
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">登录账号</span>
              <span class="text-sm font-medium">{{ user.userName }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">微信ID</span>
              <span class="text-sm font-medium">{{ user.weiXinOpenid || '未绑定' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">手机号</span>
              <span class="text-sm font-medium">{{ user.phone || '未绑定' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">邮箱</span>
              <span class="text-sm font-medium">{{ user.userEmail || '未绑定' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">注册时间</span>
              <span class="text-sm font-medium">{{ user.addedAt }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-muted-foreground">会员等级</span>
              <span class="text-sm font-medium">{{ level ? level.pricePlan : '未知' }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-muted-foreground">会员到期</span>
              <span class="text-sm font-medium">{{ user.memberExp || '未开通' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="sticky bottom-0 bg-background border-t p-4">
      <div class="flex space-x-3">
        <XButton
          class="flex-1"
          label="编辑"
          icon="lucide:edit"
          @click="openUpdate"
        />
        <XButton
          class="flex-1"
          label="删除"
          color="danger"
          icon="lucide:trash-2"
          @click="handleDelete"
        />
      </div>
    </div>
  </SlideRight>
</template>
