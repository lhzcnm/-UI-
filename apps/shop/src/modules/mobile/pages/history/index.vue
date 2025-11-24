<script setup lang="ts">
// import TheMobileTool from '@mobile/components/TheMobileTool.vue'
// import SelectService from '@mobile/components/SelectService.vue'

import { orderSearch } from '@/api/shop'
import type { OrderSearchForm } from '@/inters/order'
// import { debounce } from '@3un/utils'
import { HISTORY_STORE, type HistoryStore } from './utils'
import SearchModal from './components/SearchModal.vue'

const store: HistoryStore = reactive({
  visibleSearch: false,
})

provide(HISTORY_STORE, store)

const shopStore = useShopStore()
const route = useRoute()
const { t } = useI18n()

// const imeis = ref<string>("")
// const codeIds = ref<string>("")

watch(
  () => route.params.codeId,
  (value) => {
    shopStore.historySearch.codeIdList?.push(...value)
  }
)

watch(
  () => shopStore.historySearch,
  async (params) => {
    await getOrderList(params)
  },
  {
    immediate: true,
    deep: true,
  }
)

async function getOrderList(params: OrderSearchForm) {
  const data = await orderSearch(params)
  shopStore.historys = data
}

// const handleInput = debounce(() => {
//   shopStore.historySearch.imeiList = imeis.value.split("\n")
//   shopStore.historySearch.codeIdList = codeIds.value.split("\n")
// })
</script>

<template>
  <div class="space-y-6">
    <section class="flex justify-between p-3 border-b">
      <!-- <TheMobileTool>
        <template #default>
          <XSimplePagination
            v-model="shopStore.historySearch.page"
            :limit="shopStore.historySearch.pageSize"
            :total="shopStore.historys.total"
          />
        </template>

        <template #extra>
          <div class="flex flex-col space-y-2">
            <SelectService v-model="shopStore.historySearch.serviceId" v-model:group="shopStore.historySearch.groupId" class="flex space-x-3" />
            <XInput v-model="codeIds" @input="handleInput" :placeholder="t('order.history.placeholder.imei')" />
            <XInput v-model="imeis" @input="handleInput" :placeholder="t('order.history.placeholder.codeId')" />
          </div>
        </template>
      </TheMobileTool> -->
      
      <XButton
        :label="t('button.query')"
        color="success" icon="lucide:circle-question-mark"
        @click="store.visibleSearch = true"
      />

      <XSimplePagination
        v-model="shopStore.historySearch.page"
        :limit="shopStore.historySearch.pageSize"
        :total="shopStore.historys.total"
      />
    </section>

    <section class="">
      <HistoryCard
        v-for="order in shopStore.historys.list" :key="order.id"
        :order="order"
      />
    </section>

    <SearchModal />
  </div>
</template>
