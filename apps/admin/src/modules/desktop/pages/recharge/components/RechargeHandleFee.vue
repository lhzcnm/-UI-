<script setup lang="ts">
import { useCopyFn } from '@3un/utils'
import { RECHARGE_STORE } from '../utils'
import RechargeHandleFeeForm from './RechargeHandleFeeForm.vue'
import { updateConfig } from '@/api/settings'
import { toast } from 'vue-sonner'

const store = inject(RECHARGE_STORE)!

const copyFn = useCopyFn(() => store.handleFee)
const form = ref(copyFn())

watch(
  () => store.visibleHandleFee,
  (val) => {
    if (val) {
      form.value = copyFn()
    }
  }
)

async function handFeeSave() {
  const { aliThreshold, aliFee, wxThreshold, wxFee } = form.value

  try {
    await updateConfig([
      {
        key: 'recharge:threshold',
        value: aliThreshold,
      },
      {
        key: 'recharge:fee',
        value: (+aliFee / 100).toFixed(2),
      },
      {
        key: 'recharge:wxThreshold',
        value: wxThreshold,
      },
      {
        key: 'recharge:wxFee',
        value: (+wxFee / 100).toFixed(2),
      },
    ])

    toast.success('保存成功')
    store.visibleHandleFee = false
    store.handleFee = form.value
  } catch {}
}
</script>

<template>
  <XDialog v-model="store.visibleHandleFee"
    title="手续费设置"
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 border-b">
    <template #default>
      <RechargeHandleFeeForm class="p-4 border-b" v-model="form" />
    </template>
    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton label="取消" variant="soft" @click="store.visibleHandleFee = false" />
        <XButton label="保存" @click="handFeeSave" />
      </div>
    </template>
  </XDialog>
</template>
