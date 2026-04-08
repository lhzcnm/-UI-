<script setup lang="ts">
import { type OrderAutoCleanSettings } from '@/inters/orders';
import { ORDER_STORE } from '../utils'
import { useCopyFn } from '@3un/utils';
import { updateSetting } from '@/api/settings';

const store = inject(ORDER_STORE)!
const iStore = useSystemStore()

const cloned = useCopyFn(() => ({
  autoCleanEnable: iStore.settings["AutoCleanEnable"] ?? false,
  orderRetainDays: iStore.settings["OrderRetainDays"] ?? 30,
}))
const form = ref<OrderAutoCleanSettings>(cloned())

watch(
  () => store.visibleAutoClean,
  (val) => val && (form.value = cloned())
)

async function handleSubmit() {
  const { autoCleanEnable, orderRetainDays } = form.value

  // console.log(AutoCleanEnable)
  // console.log(OrderRetainDays)
  await updateSetting([
    { name: 'AutoCleanEnable', status: autoCleanEnable },
    { name: 'OrderRetainDays', content: orderRetainDays.toString() },
  ])

  handleClose()
  await iStore.getSetting()
}

function handleClose() {
  store.visibleAutoClean = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleAutoClean"
    draggable
    title="订单自动清理"
    ui-root="sm:p-0"
    ui-header="p-4 border-b"
  >
    <template #default>
      <OrderAutoCleanForm class="p-4" v-model="form" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton variant="soft" @click="handleClose">取消</XButton>
        <XButton @click="handleSubmit">提交</XButton>
      </div>
    </template>
  </XDialog>
</template>
