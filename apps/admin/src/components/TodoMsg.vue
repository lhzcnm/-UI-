<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface TheProps {
  uiBtn: string
}

const props = defineProps<TheProps>()
const iStore = useSystemStore()

const open = ref(false)

const totalCount = computed(() => {
  return iStore.todoCount.ticket + 
    iStore.todoCount.awaiting + 
    iStore.todoCount.verifying + 
    iStore.todoCount.processing
})

const todoItems = computed(() => [
  {
    key: 'ticket',
    label: '待处理工单',
    count: iStore.todoCount.ticket,
    icon: 'lucide:messages-square',
    route: '/tickets'
  },
  {
    key: 'verifying',
    label: '待验证订单',
    count: iStore.todoCount.verifying,
    icon: 'lucide:triangle-alert',
    route: '/orders/verify'
  },
  {
    key: 'awaiting',
    label: '等待处理订单',
    count: iStore.todoCount.awaiting,
    icon: 'lucide:hourglass',
    route: '/orders?q=wait'
  },
  {
    key: 'processing',
    label: '正在处理订单',
    count: iStore.todoCount.processing,
    icon: 'lucide:square-activity',
    route: '/orders?q=processing'
  }
].filter(item => item.count > 0))

async function refreshTodo() {
  await iStore.getTodoMsg()
}
</script>

<template>
  <XPopover
    v-model="open"
    close-on-click-outside
  >
    <template #trigger>
      <button :class="twJoin(props.uiBtn, 'relative')">
        <Icon icon="lucide:bell" class="size-5" />
        <XBadge
          v-if="totalCount > 0" :value="totalCount"
          class="absolute -top-1 -right-1 border-2 border-card"
        />
      </button>
    </template>

    <div class="w-48">
      <div class="flex items-center justify-between px-3 py-2 border-b border-dashed">
        <h3 class="font-bold">待办消息</h3>
        <button
          class="p-1.5 rounded hover:bg-muted text-muted-foreground"
          @click="refreshTodo"
        >
          <Icon icon="lucide:refresh-cw" class="size-4" />
        </button>
      </div>

      <div class="p-1">
        <div
          v-if="todoItems.length === 0"
          class="text-center py-8 text-muted-foreground">
          <Icon icon="lucide:check-circle" class="size-6 mx-auto mb-2" />
          <div class="text-sm">暂无待办消息</div>
        </div>

        <button
          v-for="item in todoItems" :key="item.key"
          :class="twJoin(
            'flex items-center space-x-2 px-3 py-1.5 w-full',
            'text-left hover:bg-accent/15 rounded'
          )"
          @click="$router.push(item.route)"
        >
          <Icon :icon="item.icon" class="size-4" />
          <div class="flex-1 text-sm">{{ item.label }}</div>
          <div class="flex items-center space-x-1">
            <XBadge :value="item.count" />
          </div>
        </button>
      </div>
    </div>
  </XPopover>
</template>
