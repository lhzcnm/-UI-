<script setup lang="ts">
import { DETAIL_STORE } from '../utils';
import PayMethod from './PayMethod.vue'

import { toast } from 'vue-sonner'

interface ConfirmDialogEmits {
  submit: []
}

const store = inject(DETAIL_STORE)!
const shopStore = useShopStore()
const { t } = useI18n()

const emits = defineEmits<ConfirmDialogEmits>()

const visiblePayMethod = ref<boolean>(false)

function handleClick() {
  if(store.submitForm.imeiList.length === 0) {
    return toast.warning(t('order.prompt.imei'))
  }
  if(!visiblePayMethod.value) {
    visiblePayMethod.value = true
  } else {
    visiblePayMethod.value = false
    store.visibleConfirm = false
    emits('submit')
  }
}

function handleCancel() {
  store.visibleConfirm = false
  visiblePayMethod.value = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleConfirm" ui-root="max-h-[32rem]"
    :title="t('order.submit.title')"
    @close="handleCancel">
    <template #default>
      <template v-if="!visiblePayMethod">
        <div class="flex flex-col">
          <div class="flex flex-col">
            <span>{{ t('order.submit.count', { count: store.submitForm.imeiList.length }) }}</span>
            <div class="bg-zinc-100 dark:bg-zinc-900 rounded p-2 flex flex-col">
              <span v-for="imei in store.submitForm.imeiList" :key="imei">{{ imei }}</span>
            </div>
          </div>
          <div class="">
            <span>{{ t('order.submit.amount') }}: </span>
            <span class="text-danger text-lg font-bold">{{ +shopStore.selService!.storePrice * store.submitForm.imeiList.length }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <PayMethod v-model="store.payType" />
      </template>
    </template>
    <template #footer>
      <div class="mt-2 flex justify-end space-x-2">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="handleCancel" @confirm="handleClick"
        />
      </div>
    </template>
  </XDialog>
</template>
