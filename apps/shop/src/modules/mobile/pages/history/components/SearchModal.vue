<script setup lang="ts">
import TheModal from '@mobile/components/TheModal.vue'
import SelectService from '@mobile/components/SelectService.vue'
import FormField from '@mobile/components/FormField.vue'

import { HISTORY_STORE } from '../utils'
import type { OrderSearchForm } from '@/inters/order'

// const visible = re
const store = inject(HISTORY_STORE)!
const shopStore = useShopStore()
const { t } = useI18n()

const imeis = ref<string>("")
const codeIds = ref<string>("")
const groupId = ref<number>(-1)
const serviceId = ref<number>(-1)

watch(
  () => shopStore.historySearch,
  () => {
    imeis.value = shopStore.historySearch.imeiList ? shopStore.historySearch.imeiList.join("\n") : ""
    codeIds.value = shopStore.historySearch.codeIdList ? shopStore.historySearch.codeIdList.join("\n") : ""
    groupId.value = shopStore.historySearch.groupId ?? -1
    serviceId.value = shopStore.historySearch.serviceId ?? -1
  },
  {
    deep: true,
    immediate: true,
  }
)

function handleCancel() {
  store.visibleSearch = false
  imeis.value = shopStore.historySearch.imeiList ? shopStore.historySearch.imeiList.join("\n") : ""
  codeIds.value = shopStore.historySearch.codeIdList ? shopStore.historySearch.codeIdList.join("\n") : ""
  groupId.value = shopStore.historySearch.groupId ?? -1
  serviceId.value = shopStore.historySearch.serviceId ?? -1
}

function handleConfirm() {
  shopStore.historySearch = {
    ...shopStore.historySearch,
    serviceId: serviceId.value === -1 ? undefined : serviceId.value,
    groupId: groupId.value === -1 ? undefined : groupId.value,
    imeiList: imeis.value ? imeis.value.split("\n") : undefined,
    codeIdList: codeIds.value ? codeIds.value.split("\n") : undefined,
    page: 1,
  }
  store.visibleSearch = false
}

function handleClear() {
  const init: OrderSearchForm = {
    page: 1,
    pageSize: 20,
    serviceId: undefined,
    codeIdList: [],
    imeiList: [],
  }

  Object.assign(shopStore.historySearch, init)
}
</script>

<template>
  <TheModal
    v-model="store.visibleSearch"
    :title="t('shop.tool.title.order')"
  >
    <template #default>
      <form class="h-full overflow-y-auto p-4" @submit.prevent>
        <FormField variant="vertical" :label="t('service.select')">
          <SelectService class="flex-1 flex flex-col space-y-3" v-model="serviceId" v-model:group="groupId" />
        </FormField>
        <FormField variant="vertical" :label="t('shop.search.codeId.title')">
          <XTextarea rows="6" :placeholder="t('shop.search.codeId.placeholder')" v-model="codeIds" />
        </FormField>
        <FormField variant="vertical" label="imei/sn">
          <XTextarea rows="6" :placeholder="t('shop.search.imei.placeholder')" v-model="imeis" />
        </FormField>
      </form>
      <div class="flex justify-between space-x-2 py-2 px-4">
        <XButton
          :label="t('button.clearFilter')" color="success" variant="outline"
          @click="handleClear"
        />
        <div class="flex space-x-2">
          <ButtonGroup
            :layouts="['cancel', 'confirm']"
            @cancel="handleCancel" @confirm="handleConfirm"
          />
        </div>
      </div>
    </template>
  </TheModal>
</template>
