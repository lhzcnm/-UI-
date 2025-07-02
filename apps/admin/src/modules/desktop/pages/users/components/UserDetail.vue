<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { XTagProps } from '@3un/ui'
import { USER_ROLE_MAP } from '@3un/utils'

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
</script>

<template>
  <XDialog
    v-model="store.visibleDetail"
    ui-root="sm:max-w-xl sm:p-0"
    ui-header="p-4 pb-0"
    title="用户详情"
  >
    <div class="px-4 pb-4 space-y-4">
      <div class="flex items-center space-x-4 rounded p-4 border">
        <img :src="headImgUrl" class="size-16 rounded-full border" />
        <div>
          <h3 class="text-lg font-semibold">{{ user.nickName || user.userName }}</h3>
          <div class="flex items-center text-sm text-muted-foreground">
            <span>ID {{ user.userId }}</span><span>•</span>
            <span>{{ USER_ROLE_MAP[user.role].label }}</span>
          </div>
        </div>
        <div class="self-start flex-1 text-right text-sm text-muted-foreground">
          <div class="inline-flex items-center bg-success text-sm text-white px-2 py-1 rounded-full">
            <Icon icon="lucide:credit-card" class="size-5 mr-2" />
            <span class="font-bold">{{ user.credits }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded p-4 border">
          <h4 class="font-bold mb-2">账户统计</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>累计充值</span>
              <span class="font-medium">{{ extraInfo.totalCredit }}</span>
            </div>
            <div class="flex justify-between">
              <span>消费积分</span>
              <span class="font-medium">{{ extraInfo.consumeCredit }}</span>
            </div>
            <div class="flex justify-between">
              <span>未付积分</span>
              <span class="font-medium">{{ extraInfo.unpaidCredit }}</span>
            </div>
            <div class="flex justify-between">
              <span>锁定积分</span>
              <span class="font-medium">{{ extraInfo.lockedCredit }}</span>
            </div>
          </div>
        </div>

        <div class="rounded p-4 border">
          <h4 class="font-bold mb-2">订单统计</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>总订单</span>
              <span>{{ extraInfo.totalCode }}</span>
            </div>
            <div class="flex justify-between">
              <span>成功订单</span>
              <span>{{ extraInfo.successCode }}</span>
            </div>
            <div class="flex justify-between">
              <span>其他订单</span>
              <span>{{ extraInfo.totalCode - extraInfo.successCode }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border rounded">
        <h4 class="px-4 py-2 border-b font-bold">详细信息</h4>
        <div class="grid grid-cols-2 gap-2 p-4 text-sm">
          <div class="space-y-3">
            <div>
              <label class="text-muted-foreground">登录账号</label>
              <div class="font-medium">{{ user.userName }}</div>
            </div>
            <div>
              <label class="text-muted-foreground">微信ID</label>
              <div class="font-medium">{{ user.weiXinOpenid || '未绑定' }}</div>
            </div>
            <div>
              <label class="text-muted-foreground">手机号</label>
              <div class="font-medium">{{ user.phone || '未绑定' }}</div>
            </div>
            <div>
              <label class="text-muted-foreground">邮箱</label>
              <div class="font-medium">{{ user.userEmail || '未绑定' }}</div>
            </div>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-muted-foreground">注册时间</label>
              <div class="font-medium">{{ user.addedAt }}</div>
            </div>
            <div>
              <label class="text-muted-foreground">会员等级</label>
              <div class="font-medium">{{ level ? level.pricePlan : '未知' }}</div>
            </div>
            <div>
              <label class="text-muted-foreground">会员到期</label>
              <div class="font-medium">{{ user.memberExp || '未开通' }}</div>
            </div>
            <div>
              <label class="block text-muted-foreground">状态</label>
              <XTag
                :color="status.color"
                :label="status.label"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </XDialog>
</template>
