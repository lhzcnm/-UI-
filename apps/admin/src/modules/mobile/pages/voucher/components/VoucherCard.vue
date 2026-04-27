<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import {
  VOUCHER_ENUM,
  VOUCHER_ENUM_MAP,
  VOUCHER_STATUS,
  VOUCHER_STATUS_List,
  VOUCHER_STATUS_MAP,
  VOUCHER_TYPE,
  VOUCHER_TYPE_MAP,
} from '@3un/utils'

import { invalidCode } from '@/api/voucher'
import type { VoucherUpdateForm } from '@/inters/voucher'
import { VOUCHER_STORE } from '../utils'

interface VoucherCardProps {
  id: number
  code: string
  amount: string
  expireTs: number
  createTime: string
  useTime: string | null
  status: number
  userId: number | null
  type: VOUCHER_ENUM
  creditType: VOUCHER_TYPE | null
}

interface VoucherCardEmits {
  delete: [id: number],
}

const props = defineProps<VoucherCardProps>()
const emits = defineEmits<VoucherCardEmits>()

const store = inject(VOUCHER_STORE)!

const formatValue = (v?: string | number | null) => v ?? '--'

const visible = ref<boolean>(false)

const voucherType = computed(() => VOUCHER_TYPE_MAP[props.creditType ?? VOUCHER_TYPE.COMMON])

function handleClick(status: VOUCHER_STATUS) {
  if(props.status === VOUCHER_STATUS.USED) {
    return toast.warning("无法更新已使用的积分券状态")
  }

  const params: VoucherUpdateForm = {
    code: props.code,
    status: status,
  }

  invalidCode(params).then(() => {
    toast.success('更新成功')
  }).catch(({ message }) => {
    toast.error(message)
  }).finally(() => {
    store.refresh = true
    visible.value = false
  })
}
</script>

<template>
  <div
    class="voucher relative w-full rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors duration-200"
  >
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        积分券
      </h3>

      <div class="flex items-center space-x-2">
        <XTag :color="VOUCHER_ENUM_MAP[type].color" :label="VOUCHER_ENUM_MAP[type].label" />
        <XTag :color="voucherType.color" :label="voucherType.label" />
  
        <XPopover
          v-model="visible"
          placement="bottom-end"
          close-on-click-outside>
          <template #trigger>
            <button
              class="bg-transparent" @click.stop>
              <Icon icon="lucide:ellipsis-vertical" />
            </button>
          </template>
          <template #default>
            <div class="flex flex-col">
              <button
                v-for="status in VOUCHER_STATUS_List" :key="status.value"
                class="bg-transparent flex items-center px-2 py-2 text-sm border-b last:border-b-none"
                @click="handleClick(status.value)"
              >
                <Icon
                  v-if="props.status === status.value" icon="lucide:check"
                  class="inline-block size-4 mr-2"
                />
                {{ status.label }}
              </button>
            </div>
          </template>
        </XPopover>
      </div>
    </div>

    <div class="space-y-1 text-sm text-muted-foreground">
      <div>
        <span class="text-zinc-500 dark:text-zinc-400">金额: </span>
        <span class="font-medium text-success">{{ formatValue(amount) }}</span>
      </div>
      <div v-if="code">
        <span class="text-zinc-500 dark:text-zinc-400">券码: </span>
        <span class="break-all">{{ code }}</span>
      </div>
      <!-- <div>
        <span class="text-zinc-500 dark:text-zinc-400">积分券类型: </span>
        <XTag :color="VOUCHER_TYPE_MAP[creditType].color" :label="VOUCHER_TYPE_MAP[creditType].label" />
      </div> -->
      <div>
        <span class="text-zinc-500 dark:text-zinc-400">状态: </span>
        <span class="break-all" :class="[`text-${VOUCHER_STATUS_MAP[status].color}`]">{{ VOUCHER_STATUS_MAP[status].label }}</span>
      </div>
      <div v-if="userId">
        <span class="text-zinc-500 dark:text-zinc-400">充值用户: </span>
        <!-- <span class="break-all">{{ formatValue(userId) }}</span> -->
        <RouterLink
          :to="`/users?uid=${userId}`"
          class="underline"
        >{{ userId }}</RouterLink>
      </div>
      <div>
        <span class="text-zinc-500 dark:text-zinc-400">创建时间: </span>
        {{ formatValue(createTime) }}
      </div>
      <div>
        <span class="text-zinc-500 dark:text-zinc-400">使用时间: </span>
        {{ formatValue(useTime) }}
      </div>
      <div>
        <span class="text-zinc-500 dark:text-zinc-400">有效期(天): </span>
        {{ formatValue(expireTs) }}
      </div>
    </div>

    <div class="absolute right-4 bottom-2">
      <XButton
        icon="lucide:trash-2"
        label="删除"
        size="sm"
        color="danger"
        @click="emits('delete', id)" />
    </div>
  </div>
</template>
