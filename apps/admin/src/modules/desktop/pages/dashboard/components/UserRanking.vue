<script setup lang="ts">
import { getUserRank } from '@/api/dashboard'
import type { User } from '@/inters/users'

const list = ref<User[]>([])

await getList()
async function getList() {
  list.value = await getUserRank()
}

function getAvatar(url: string | null) {
  const mode = import.meta.env.VITE_APP_MODE
  const defaultAvatar = `/${mode}/default_avatar.jpg`

  return url || defaultAvatar
}
</script>

<template>
  <section class="border rounded w-96 overflow-hidden">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="text-lg font-bold">积分排行榜</h3>
    </div>

    <div class="px-3 divide-y">
      <div
        v-for="item in list" :key="item.userId"
        class="py-3"
      >
        <div class="flex items-center justify-between">
          <img
            :src="getAvatar(item.headImgUrl)"
            alt="Avatar" class="size-7 mr-2 border rounded"
          >
          <div class="flex-1 text-sm truncate">
            <a
              :href="`/users?uid=${item.userId}`"
              class="underline hover:text-success"
            >
              {{ item.nickName || item.userName }}
            </a>
          </div>
          <span class="text-sm">{{ item.credits }}￥</span>
        </div>
      </div>
    </div>
  </section>
</template>
