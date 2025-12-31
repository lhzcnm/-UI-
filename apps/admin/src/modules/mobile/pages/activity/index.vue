<script setup lang="ts">
import ActivitySearchModal from './components/ActivitySearchModal.vue'
import ActivityCard from './components/ActivityCard.vue'
import ActivityModal from './components/ActivityModal.vue'
import RuleModal from './components/RuleModal.vue'

import { zActivityForm, zActivitySearch, type ActivitySearch } from '@/inters/activity'
import { ACTIVITY_STORE, type ActivityStore } from './utils'
import { getActivitys } from '@/api/activity'

const store: ActivityStore = reactive({
  visibleBase: false,
  visibleSearch: false,
  visibleRule: false,

  activities: [],
  formSearch: zActivitySearch.parse({}),
  formBase: zActivityForm.parse({}),

  activityRules: [],
  activityRuleForms: [],

  refresh: false,
  index: undefined,
})

provide(ACTIVITY_STORE, store)

const loading = ref<boolean>(false)

watch(
  () => store.refresh,
  async () => {
    await getList(store.formSearch)
  },
  {
    immediate: true,
  }
)

async function getList(params: ActivitySearch) {
  try {
    loading.value = true
    store.activities = await getActivitys(params)
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  store.formSearch = zActivitySearch.parse({})
  store.refresh = !store.refresh
}

function openCreate() {
  store.index = undefined
  store.formBase = zActivityForm.parse({})
  store.visibleBase = true
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <template #extra>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <XButton
              icon="lucide:filter"
              label="筛选"
              @click="store.visibleSearch = true"
            />

            <XButton
              label="清空筛选"
              variant="outline"
              icon="lucide:brush-cleaning"
              @click="resetSearch"
            />
          </div>

          <div class="">
            <XButton
              label="新增活动"
              color="success"
              icon="lucide:plus"
              @click="openCreate"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <template v-if="!loading && store.activities.length === 0">
        <NoMessage
          class="h-auto bg-card border rounded-lg p-3" />
      </template>

      <template v-else v-for="(item, index) in store.activities">
        <ActivityCard :index="index" :activity="item" />
      </template>
    </section>

    <ActivityModal />
    <RuleModal />
    <ActivitySearchModal />
  </div>
</template>
