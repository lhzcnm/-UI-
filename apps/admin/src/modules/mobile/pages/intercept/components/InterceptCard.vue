<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

import { deleteIntercept } from '@/api/intercept'
import type { Intercept } from '@/inters/intercept'
import { INTERCEPT_STORE } from '../utils'

interface TheProps {
  item: Intercept
  index: number
}

const props = defineProps<TheProps>()
const store = inject(INTERCEPT_STORE)!

async function handleDelete() {
  if (!await xconfirm('确定要删除吗？')) return

  deleteIntercept(props.item.id).then(() => {
    store.intercepts.splice(props.index, 1)
    toast.success('解除成功')
  })
}
</script>

<template>
  <div class="bg-card border rounded-lg">
    <div class="flex items-center justify-between p-3 pb-0">
      <h3 class="text-lg font-bold">{{ item.id }}</h3>
      <span class="text-sm text-muted-foreground">{{ item.ip }}</span>
    </div>

    <div class="px-3 py-2 text-sm">
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">创建时间：</span>
        <span class="font-medium break-all">{{ item.createTime }}</span>
      </div>
      <div class="flex items-center mb-2">
        <span class="text-muted-foreground shrink-0">过期时间：</span>
        <span class="font-medium break-all">{{ item.expireTime || '永久' }}</span>
      </div>

      <div class="text-muted-foreground mb-1">备注</div>
      <div class="bg-muted rounded p-3 whitespace-pre-line overflow-x-auto">
        {{ item.comments || '--' }}
      </div>
    </div>

    <div
      :class="twJoin(
        'flex items-center justify-end mt-2',
        'px-3 py-2 border-t border-dashed',
      )"
    >
      <XButton
        label="解除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click.stop="handleDelete"
      />
    </div>
  </div>
</template>
