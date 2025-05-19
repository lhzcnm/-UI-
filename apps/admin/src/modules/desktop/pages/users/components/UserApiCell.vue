<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { XPopover } from '@3un/ui'

import type { User } from '@/inters/users'
import { USER_STORE } from '../utils'

interface UserApiCellProps {
  row: User
  index: number
  value: string | null
  refresh: (id: number) => Promise<string>
}

const props = defineProps<UserApiCellProps>()

const { copy } = useClipboard()
const store = inject(USER_STORE)!

const visible = ref(false)

async function handleRefresh() {
  const key = await props.refresh(props.row.userId)
  store.users.list[props.index].apiKey = key
  toast.success('刷新成功')
}

function handleCopy() {
  copy(props.value!)
  toast.success('复制成功')
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <a
      href="javascript:void(0)"
      class="flex items-center space-x-1 hover:text-success underline"
      @click="handleRefresh"
    >
      <Icon icon="lucide:refresh-cw" />
      <span>刷新</span>
    </a>
    <XPopover
      v-if="value"
      v-model="visible"
      trigger="hover"
      placement="top"
    >
      <template #trigger>
        <a
          href="javascript:void(0)"
          class="flex items-center space-x-1 hover:text-success underline"
          @click="handleCopy"
        >
          <Icon icon="lucide:copy" />
          <span>复制</span>
        </a>
      </template>
      <div class="px-2 py-1 text-sm">{{ value }}</div>
    </XPopover>
  </div>
</template>
