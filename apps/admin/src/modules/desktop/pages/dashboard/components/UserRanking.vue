<script setup lang="ts">
import { getUserRank } from '@/api/dashboard'
import type { UserList } from '@/inters/users'
import { createList, getAvatar } from '@/utils'

const users = ref<UserList>(createList())

const loading = ref(false)
const page = ref(1)

watch(
  page,
  (val) => {
    loading.value = true
    getUserRank(val)
      .then((res) => users.value = res)
      .finally(() => loading.value = false)
  },
  { immediate: true }
)
</script>

<template>
  <section class="border rounded overflow-hidden">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="text-lg font-bold">积分排行榜</h3>
      <XSimplePagination
        v-model="page"
        size="sm"
        :limit="10"
        :total="users.total"
      />
    </div>

    <div class="relative divide-y">
      <div v-show="loading" class="absolute w-full h-0.5 overflow-hidden bg-primary/10">
        <div class="h-full w-1/3 x-animation-slide rounded bg-primary" />
      </div>
      <div
        v-for="item in users.list" :key="item.userId"
        class="p-3"
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
