<script setup lang="ts">
import { zMonitorForm, zMonitorSearch, type MonitorServerSearchForm } from '@/inters/monitor/server';
import { MONITOR_SERVER_STORE, type MonitorServerStore } from './utils'
import { createList, defaultPageSize } from '@/utils';
import { getMonitorServers } from '@/api/monitor';
import MonitorServerCard from './components/MonitorServerCard.vue';
import MonitorServerModal from './components/MonitorServerModal.vue';
import MonitorServerSearch from './components/MonitorServerSearch.vue';

const store: MonitorServerStore = reactive({
  visibleBase: false,
  visibleSearch: false,

  formSearch: zMonitorSearch.parse({}),
  formBase: zMonitorForm.parse({}),
  servers: createList(),

  page: 1,
  limit: defaultPageSize,
  refresh: false,
  serverId: undefined,
  domainId: undefined,
})

provide(MONITOR_SERVER_STORE, store)

const loading = ref<boolean>(false)

watch(
  [
    () => store.page,
    () => store.refresh,
  ],
  async ([pageVal]) => {
    await getList({
      ...store.formSearch,
      page: pageVal,
      pageSize: store.limit,
    })
  },
  {
    immediate: true,
  }
)

async function getList(params: MonitorServerSearchForm) {
  try {
    loading.value = true
    store.servers = await getMonitorServers(params)
  } finally {
    loading.value = false
  }
}

function initSearchData() {
  store.formSearch = zMonitorSearch.parse({})
  store.refresh = !store.refresh
}
</script>

<template>
  <div>
    <Toolbar>
      <template #default>
        <XSimplePagination v-model="store.page"
          :limit="store.limit"
          :total="store.servers.total" />
      </template>

      <template #extra>
        <div class="flex space-x-2">
          <XButton label="筛选" icon="lucide:filter" @click="store.visibleSearch = true" />
          <XButton label="清除筛选" icon="lucide:trash-2" variant="outline" @click="initSearchData" />
        </div>
      </template>
    </Toolbar>

    <section class="overscroll-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <template v-if="!loading && store.servers.list.length === 0">
        <NoMessage
          class="h-auto bg-card border rounded-lg p-3" />
      </template>

      <template v-else v-for="(item) in store.servers.list">
        <MonitorServerCard :server="item" />
      </template>
    </section>

    <MonitorServerModal />
    <MonitorServerSearch />
  </div>
</template>
