<script setup lang="ts">
import ItemModal from './components/ItemModal.vue'
import ItemUpstream from './components/ItemUpstream.vue'
import ItemCard from './components/ItemCard.vue'

import { zServiceForm } from '@/inters/services'
import { getUpstreams } from '@/api/upstream'

import { SERVICE_STORE, type ServiceStore } from './utils'

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  upstreams: [],

  formBase: zServiceForm.parse({}),
  formSearch: { categoryId: -1, keyword: '' },
  formUpstream: {
    apiId: undefined,
    serviceId: undefined,
    externalNetworkId: undefined,
  },

  visibleBase: false,
  visibleUpstream: false,

  index: undefined,
})

provide(SERVICE_STORE, store)

const route = useRoute()
const router = useRouter()

watch(
  () => route.query,
  ({ cid, id }) => {
    store.formSearch = {
      categoryId: cid ? +cid : -1,
      keyword: (id as string) || '',
    }
  },
  { immediate: true },
)

const displayItems = computed(() => {
  let items = serviceStore.items
  let { categoryId, keyword } = store.formSearch
  keyword = keyword.trim().toLowerCase()

  if (categoryId !== -1) {
    items = items.filter(item => item.categoryId === categoryId)
  }

  if (keyword) {
    items = items.filter(item =>
      item.tmpTitle.toLowerCase().includes(keyword) ||
      item.packageTitle.toLowerCase().includes(keyword) ||
      item.packageTitleLocal.toLowerCase().includes(keyword) ||
      item.packageId.toString().includes(keyword)
    )
  }

  return items
})

initUpstreams()
async function initUpstreams() {
  const data = await getUpstreams()
  store.upstreams = data
}

function openCreate() {
  store.formBase = zServiceForm.parse({})
  store.index = undefined
  store.visibleBase = true
}

type ClearType = 'category' | 'keyword'
function handleClear(type: ClearType) {
  router.replace({ path: route.path, query: {[type]: undefined}})
}
</script>

<template>
  <div>
    <Toolbar>
      <XButton
        label="新增"
        color="success"
        icon="lucide:circle-plus"
        @click="openCreate"
      />

      <template #extra>
        <div class="space-y-2" @click.stop>
          <div>
            <label class="block text-sm text-label mb-1">服务组</label>
            <XNativeSelect
              v-model="store.formSearch.categoryId"
              :options="serviceStore.groups"
              :default="-1"
              placeholder="请选择服务组"
              value-key="categoryId"
              label-key="category"
            />
          </div>

          <div>
            <label class="block text-sm text-label mb-1">关键词</label>
            <XInput
              v-model="store.formSearch.keyword"
              clearable
              placeholder="请输入关键词"
              @clear="handleClear('keyword')"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <ItemCard
        v-for="(item, index) in displayItems"
        :key="item.packageId" :item="item" :index="index"
      />
    </section>

    <ItemModal />
    <ItemUpstream />
  </div>
</template>
