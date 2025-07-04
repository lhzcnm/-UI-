<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Service } from '@/inters/services'
import { SERVICE_STORE } from '../utils'
import { zService } from '@/inters/services'
import { updateService } from '@/api/services'

interface TheProps {
  item: Service
  index: number
}

const props = defineProps<TheProps>()
const store = inject(SERVICE_STORE)!
const serviceStore = useServiceStore()

const groupName = computed(() => {
  const group = serviceStore.groupMap.get(props.item.categoryId)
  return group ? group.category : '默认服务组'
})

const apiName = computed(() => {
  const api = serviceStore.items.find(item => item.apiId === props.item.apiId)
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
    apiId: props.item.apiId === -1 ? undefined : props.item.apiId,
    externalNetworkId: props.item.externalNetworkId,
  }
}

async function handleToggleDisable() {
  const oldVal = props.item.disablePackage
  try {
    props.item.disablePackage = !oldVal
    await updateService({
      packageId: props.item.packageId,
      disablePackage: props.item.disablePackage,
    })
  } catch (error) {
    props.item.disablePackage = oldVal
    throw error
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

      <div class="flex items-center space-x-1">
        <div
          v-if="item.disablePackage"
          class="w-2 h-2 bg-destructive rounded-full"
          title="已禁用"
        />
        
        <div class="flex space-x-1">
          <XTag v-if="item.isNew" color="info" size="sm" label="新" />
          <XTag v-if="item.isHot" color="danger" size="sm" label="热" />
          <XTag v-if="item.isUnlock" color="success" size="sm" label="解锁" />
        </div>
      </div>
    </div>

    <div class="p-3 space-y-3">
      <div>
        <h3 class="font-medium text-foreground leading-tight">{{ item.tmpTitle }}</h3>
        <p class="text-sm text-muted-foreground mt-1 leading-tight">{{ item.packageTitle }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span class="text-muted-foreground">价格:</span>
          <span class="font-medium ml-1">¥{{ item.packagePrice }}</span>
        </div>
        <div>
          <span class="text-muted-foreground">API:</span>
          <span class="ml-1" :class="item.apiId === -1 ? 'text-muted-foreground' : 'text-foreground'">
            {{ apiName }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t">
        <button
          class="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          @click="handleConfigApi"
        >
          <Icon icon="lucide:settings" class="w-4 h-4" />
          <span>配置API</span>
        </button>

        <div class="flex items-center space-x-2">
          <button
            class="flex items-center space-x-1 text-sm transition-colors"
            :class="item.disablePackage ? 'text-destructive hover:text-destructive/80' : 'text-muted-foreground hover:text-foreground'"
            @click="handleToggleDisable"
          >
            <Icon :icon="item.disablePackage ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
            <span>{{ item.disablePackage ? '已禁用' : '正常' }}</span>
          </button>

          <button
            class="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
            @click="handleEdit"
          >
            <Icon icon="lucide:edit" class="w-4 h-4" />
            <span>编辑</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
