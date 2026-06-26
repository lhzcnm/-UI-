<script setup lang="ts">
import UpstreamCard from './components/UpstreamCard.vue'
import UpstreamModal from './components/UpstreamModal.vue'
import { zUpstreamForm } from '@/inters/upstream'
import { getUpstreams } from '@/api/upstream'

import { API_TYPE, API_TYPE_LIST } from '@3un/utils'
import { isNullish } from '@3un/ui'

import type { UpstreamStore } from './utils'
import { UPSTREAM_STORE } from './utils'
import { defaultPageSize } from '@/utils/common.ts'

const store: UpstreamStore = reactive({
  upstreams: await getUpstreams(),

  formBase: zUpstreamForm.parse({}),
  visibleBase: false,

  index: undefined,
  page: 1,
  limit: defaultPageSize,
})

provide(UPSTREAM_STORE, store)

const search = ref('')
const apiType = ref<API_TYPE | undefined>()

const filteredUpstreams = computed(() => {
  const searchValue = search.value.trim().toLowerCase()
  let list = store.upstreams

  if (!isNullish(apiType.value)) {
    list = list.filter(item => item.apiType === apiType.value)
  }

  if (searchValue) {
    list = list.filter(item =>
      item.apiTitle.toLowerCase().includes(searchValue) ||
      item.accountId?.toLowerCase().includes(searchValue) ||
      item.serverUrl.toLowerCase().includes(searchValue) ||
      item.apiKey?.toLowerCase().includes(searchValue)
    )
  }

  return list
})

const displayUpstreams = computed(() => {
  return filteredUpstreams.value.slice(
    (store.page - 1) * store.limit,
    store.page * store.limit
  )
})

function openCreate() {
  store.formBase = zUpstreamForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <Toolbar>
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="filteredUpstreams.length"
      />

      <template #extra>
        <div class="space-y-3" @click.stop>
          <div>
            <label class="block text-label text-sm mb-1">API类型</label>
            <XNativeSelect
              v-model="apiType"
              placeholder="选择API类型"
              :options="API_TYPE_LIST"
              value-key="value"
              label-key="label"
            />
          </div>
          <div>
            <label class="block text-label text-sm mb-1">搜索</label>
            <XInput
              v-model="search"
              icon="lucide:search"
              placeholder="搜索"
              clearable
            />
          </div>
          <div>
            <label class="block text-label text-sm mb-1">操作</label>
            <XButton
              label="新增API"
              class="mr-2"
              color="success"
              icon="lucide:plus"
              @click="openCreate"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="displayUpstreams.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <UpstreamCard
          v-for="(item, index) in displayUpstreams"
          :key="item.apiId" :item="item" :index="index"
        />
      </template>
    </section>

    <UpstreamModal />
  </div>
</template>
