<script setup lang="ts">
import PayMethod from '../PayMethod.vue'

import { SERVICE_STORE } from '../../utils/symbol'

interface ConfirmDialogEmits {
  submit: []
}

const store = inject(SERVICE_STORE)!

const emits = defineEmits<ConfirmDialogEmits>()

const visiblePayMethod = ref<boolean>(false)

function handleClick() {
  if(!visiblePayMethod.value) {
    visiblePayMethod.value = true
  } else {
    visiblePayMethod.value = false
    store.visibleConfirm = false
    emits('submit')
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleConfirm" ui-root="max-h-[32rem]"
    title="下单确认">
    <template #default>
      <template v-if="!visiblePayMethod">
        <div class="flex flex-col">
          <div class="flex flex-col">
            <span>您提交的有效IMEI数量为{{ store.imeiList.length }}, 是否确认提交?</span>
            <div class="bg-zinc-100 rounded p-2 flex flex-col">
              <span v-for="imei in store.imeiList" :key="imei">{{ imei }}</span>
            </div>
          </div>
          <div class="">
            <span>预计金额: </span>
            <span class="text-danger text-lg font-bold">{{ +store.selectService.storePrice * +store.imeiList.length }}</span>
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
          @cancel="store.visibleConfirm = false" @confirm="handleClick"
        />
      </div>
    </template>
  </XDialog>
</template>
