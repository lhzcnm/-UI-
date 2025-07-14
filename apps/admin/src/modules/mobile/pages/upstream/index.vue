<script setup lang="ts">
import UpstreamCard from './components/UpstreamCard.vue'
import UpstreamModal from './components/UpstreamModal.vue'
import { zUpstreamForm } from '@/inters/upstream'
import { getUpstreams } from '@/api/upstream'

import { API_TYPE, API_TYPE_LIST } from '@3un/utils'
import { isNullish } from '@3un/ui'

import type { UpstreamStore } from './utils'
import { UPSTREAM_STORE } from './utils'

const store: UpstreamStore = reactive({
  upstreams: await getUpstreams(),

  formBase: zUpstreamForm.parse({}),
  visibleBase: false,

  index: undefined,
})

provide(UPSTREAM_STORE, store)

const search = ref('')
const apiType = ref<API_TYPE | undefined>()

const displayUpstreams = computed(() => {
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

function openCreate() {
  store.formBase = zUpstreamForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <Toolbar>
      <XButton
        label="新增API"
        class="mr-2"
        color="success"
        icon="lucide:plus"
        @click="openCreate"
      />

      <template #extra>
        <div class="mb-3" @click.stop>
          <label class="block text-label text-sm mb-1">API类型</label>
          <XNativeSelect
            v-model="apiType"
            placeholder="选择API类型"
            :options="API_TYPE_LIST"
            value-key="value"
            label-key="label"
          />
        </div>
        <div @click.stop>
          <label class="block text-label text-sm mb-1">搜索</label>
          <XInput
            v-model="search"
            icon="lucide:search"
            placeholder="搜索"
            clearable
          />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <UpstreamCard
        v-for="(item, index) in displayUpstreams"
        :key="item.apiId" :item="item" :index="index"
      />
    </section>

    <UpstreamModal />
  </div>
</template>
