<script setup lang="ts">
import { useCopyFn } from '@3un/utils';
import { RECHARGE_STORE } from '../utils'
import { toast } from 'vue-sonner';
import { updateConfig } from '@/api/settings';
import RechargeHandleFeeForm from './RechargeHandleFeeForm.vue';

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
  <TheModal v-model="store.visibleHandleFee"
    title="手续费设置">
    <template #default>
      <RechargeHandleFeeForm class="p-4" v-model="form" />
      <div class="flex justify-end space-x-2 p-4">
        <XButton label="取消" variant="soft" @click="store.visibleHandleFee = false" />
        <XButton label="保存" @click="handFeeSave" />
      </div>
    </template>
  </TheModal>
</template>
