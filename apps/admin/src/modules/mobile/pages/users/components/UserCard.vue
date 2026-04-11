<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { USER_ROLE_MAP } from '@3un/utils'

import type { User } from '@/inters/users'
import { getExtraInfo, loginUserFront } from '@/api/users'
import { USER_STORE } from '../utils'

interface TheProps {
  index: number
  user: User
}

const props = defineProps<TheProps>()
const store = inject(USER_STORE)!
const levelStore = useLevelStore()

const iStore = useSystemStore();
let frontUrl = iStore.configs["url"]

if (!frontUrl.endsWith("/")) {
  frontUrl += "/"
}

const level = computed(() =>
  levelStore.levelMap.get(props.user.pricePlanId!)
)

const headImgUrl = computed(() => {
  if (props.user.headImgUrl) {
    return props.user.headImgUrl
  }

  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
})

async function handleClick() {
  const userId = props.user.userId
  const extraInfo = await getExtraInfo(userId)
  store.extraInfo = extraInfo

  store.index = props.index
  store.visibleDetail = true
}

async function handleClickAuthFront() {
  const newWin = window.open("about:blank")

  try {
    const ticket = await loginUserFront({ userId: props.user.userId })
    if (newWin) {
      newWin.location.href = `${frontUrl}auth-by-ticket?ticket=${ticket}`
    }
  } catch {
    newWin?.close()
  }
}
</script>

<template>
  <button 
    class="w-full p-4 text-left bg-card border rounded-lg overflow-hidden shadow-sm"
    @click="handleClick"
  >
    <div class="flex justify-between">
      <div class="flex items-center space-x-2">
        <img :src="headImgUrl" alt="Avatar" class="size-8 rounded">
        <span class="flex-1 min-w-0 truncate font-medium">{{ user.nickName || user.userName }}</span>
      </div>

      <div class="flex items-center space-x-1 bg-muted rounded px-2 py-0.5 text-muted-foreground">
        <Icon icon="lucide:credit-card" class="size-5" />
        <span class="text-sm font-semibold">{{ user.credits }}</span>
      </div>
    </div>

    <div class="mt-2 text-sm text-muted-foreground">
      <span>ID {{ user.userId }}</span> · 
      <span>{{ USER_ROLE_MAP[user.role].label }}</span> ·
      <span>{{ level ? level.pricePlan : '未知' }}</span>
    </div>

    <div class="mt-1 space-y-1 text-sm">
      <p>微信ID: {{ user.weiXinOpenid || '未绑定' }}</p>
      <p>注册时间: {{ user.addedAt }}</p>
    </div>

    <div class="flex justify-end items-center">
      <XButton color="warning" label="登录前台" size="sm" @click.stop="handleClickAuthFront" />
    </div>
  </button>
</template>
