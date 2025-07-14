<script setup lang="ts">
import { xconfirm } from '@3un/utils'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'

import type { Log } from '@/inters/logs'
import { deleteLogs } from '@/api/logs'
import { LOG_STORE } from '../utils'

interface LogCardProps {
  item: Log
  index: number
}

const props = defineProps<LogCardProps>()
const store = inject(LOG_STORE)!

async function handleDelete() {
  if (!await xconfirm('确定删除该日志吗？')) return

  deleteLogs([props.item.id]).then(() => {
    store.logs.list.splice(props.index, 1)
    toast.success('删除成功')
  })
}
</script>

<template>
  <div class="bg-card border rounded-lg">
    <div class="flex items-center justify-between p-3 pb-0">
      <h3 class="text-lg font-bold">{{ item.id }}</h3>
    </div>

    <div class="px-3 py-2 text-sm">
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">登录IP：</span>
        <span class="font-medium break-all">{{ item.ip }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">登录时间：</span>
        <span class="font-medium break-all">{{ item.loginTime }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">登出时间：</span>
        <span class="font-medium break-all">
          {{ item.logoutTime ? item.logoutTime : '--' }}
        </span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">所属用户：</span>
        <a
          :href="`/users?uid=${item.userId}`"
          class="font-medium break-all underline"
        >
          {{ item.userId }}
        </a>
      </div>
    </div>

    <div
      :class="twJoin(
        'flex items-center justify-end',
        'px-3 py-2 border-t border-dashed',
      )"
    >
      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
