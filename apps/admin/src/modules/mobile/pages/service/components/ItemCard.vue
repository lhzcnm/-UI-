<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import type { Service } from '@/inters/services'
import { zService } from '@/inters/services'
import { SERVICE_STORE } from '../utils'
import { toUndef } from '@/utils'

interface TheProps {
  item: Service
  index: number
}

const props = defineProps<TheProps>()
const store = inject(SERVICE_STORE)!

const serviceStore = useServiceStore()

const groupName = computed(() => {
  const categoryId = props.item.categoryId
  const group = serviceStore.groupMap.get(categoryId)
  return group ? group.category : '默认服务组'
})

const apiName = computed(() => {
  const apiId = props.item.apiId
  const api = serviceStore.items
    .find(item => item.apiId === apiId)
  return api?.apiName || '未配置'
})

function handleEdit() {
  store.formBase = zService.parse(props.item)
  store.index = props.index
  store.visibleBase = true
}

function handleConfigApi() {
  store.visibleUpstream = true
  store.formUpstream = {
    serviceId: props.item.packageId,
    apiId: toUndef(props.item.apiId),
    externalNetworkId: props.item.externalNetworkId,
  }
}
</script>

<template>
  <div class="bg-card rounded-lg border overflow-hidden">
    <div class="flex items-center justify-between p-3 border-b">
      <div class="flex items-center space-x-2 text-sm text-muted-foreground">
        <span class="bg-muted px-2 py-1 rounded">#{{ item.packageId }}</span>
        <span>{{ groupName }}</span>
      </div>

      <div class="flex space-x-1">
        <XTag v-if="item.isNew" color="primary" size="sm" label="新" />
        <XTag v-if="item.isHot" color="danger" size="sm" label="热" />
        <XTag v-if="item.isUnlock" color="success" size="sm" label="解锁" />
      </div>
    </div>

    <div class="p-3 space-y-2">
      <h3>{{ item.packageTitle }}</h3>

      <div class="text-sm text-muted-foreground">
        <div>
          <span class="mr-1">上游服务:</span>
          <span>{{ apiName }}</span>
        </div>
        <div>
          <span class="mr-1">服务价格:</span>
          <span>{{ item.packagePrice }}</span>
        </div>
        <div>
          <span class="mr-1">商品服务价格:</span>
          <span>{{ item.storePrice }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-dashed">
        <button
          :class="twJoin(
            'flex items-center space-x-1 text-sm',
            'text-muted-foreground hover:text-foreground'
          )"
          @click="handleConfigApi"
        >
          <Icon icon="lucide:settings" class="size-4" />
          <span>配置API</span>
        </button>

        <button
          :class="twJoin(
            'flex items-center space-x-1 text-sm',
            'text-primary hover:text-primary/80 transition-colors'
          )"
          @click="handleEdit"
        >
          <Icon icon="lucide:edit" class="size-4" />
          <span>编辑</span>
        </button>
      </div>
    </div>
  </div>
</template>
