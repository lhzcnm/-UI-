<script setup lang="ts">
import LogSearch from './components/LogSearch.vue'
import LogCard from './components/LogCard.vue'

import { hash } from 'ohash'

import type { LogListParams } from '@/inters/logs'
import { zLogSearchForm } from '@/inters/logs'
import { getLogs } from '@/api/logs'
import { createList } from '@/utils'

import type { LogStore } from './utils'
import { LOG_STORE } from './utils'

const store: LogStore = reactive({
  logs: createList(),

  formSearch: zLogSearchForm.parse({}),
  visibleSearch: false,

  refresh: false,
  page   : 1,
  limit  : 20,
})

provide(LOG_STORE, store)

const route = useRoute()
const router = useRouter()

const loading = ref(false)

const queryHash = computed(() => hash(route.query))

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
    })
  },
)

watch(
  () => route.query,
  ({ q, uid, ip }) => {
    store.formSearch = {
      ...zLogSearchForm.parse({}),
      isAdmin: q === 'admin',
      userId: uid ? Number(uid) : undefined,
      ip: ip ? ip.toString() : undefined,
    }

    store.refresh = !store.refresh
    store.page = 1
  },
  { immediate: true },
)

function getList(params: LogListParams) {
  loading.value = true

  const response = getLogs(params)
  response.then(data => store.logs = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  router.replace({
    force: true,
    path: route.path,
    query: {q: route.query.q}
  })
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.logs.total"
      />

      <template #extra>
        <XButton
          label="筛选"
          class="mr-2"
          icon="lucide:filter"
          @click="store.visibleSearch = true"
        />
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:x"
          @click="resetSearch"
        />
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.logs.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <LogCard
          v-for="(log, index) in store.logs.list"
          :key="log.id" :item="log" :index="index"
        />
      </template>
    </section>

    <LogSearch :key="queryHash" />
  </div>
</template>
