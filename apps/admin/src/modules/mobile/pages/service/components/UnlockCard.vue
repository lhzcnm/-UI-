<script setup lang="ts">
import { xconfirm } from '@3un/utils'

import type { Unlock } from '@/inters/services'
import { zUnlockForm } from '@/inters/services'
import { deleteUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

interface TheProps {
  item: Unlock
  index: number
}

const props = defineProps<TheProps>()
const store = inject(UNLOCK_STORE)!

function openUpdate() {
  store.formBase = zUnlockForm.parse(props.item)
  store.index = props.index
  store.visibleBase = true
}
function openConvert() {
  store.visibleConvert = true
  store.index = props.index
}

async function handleDelete() {
  if (!await xconfirm('确定删除该“推荐解锁服务”吗？')) return

  deleteUnlock(props.item.id).then(() => {
    store.unlocks.splice(props.index, 1)
  })
}
</script>

<template>
  <div
    class="bg-card rounded-lg border overflow-hidden"
    @click="openUpdate"
  >
    <div class="p-3">
      <h3>{{ item.packageId }}|{{ item.name }}</h3>
      <span class="text-sm text-muted-foreground">
        触发关键字({{ item.operator }})
      </span>
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <span class="text-sm text-muted-foreground">
        {{ item.convertCode.length }} 个转换码
      </span>

      <div class="space-x-2">
        <XButton
          size="sm"
          color="danger"
          label="删除"
          icon="lucide:trash"
          @click.stop="handleDelete"
        />
        
        <XButton
          size="sm"
          label="编辑转换码"
          icon="lucide:edit"
          @click.stop="openConvert"
        />
      </div>
    </div>
  </div>
</template>
