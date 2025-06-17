<script setup lang="ts">
import ItemDrawer from './components/ItemDrawer.vue'

import { zServiceForm } from '@/inters/services'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { columns } from './utils/columnItem'
import { isNullish } from '@3un/ui'

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  formBase: zServiceForm.parse({}),
  formSearch: {
    categoryId: null,
    keyword: '',
  },
  visibleBase: false,
  index: undefined,
})

provide(SERVICE_STORE, store)

const route = useRoute()
const router = useRouter()

watch(
  () => route.query,
  ({ cid, id }) => {
    store.formSearch = {
      categoryId: cid ? +cid : null,
      keyword: (id as string) || '',
    }
  },
  { immediate: true },
)

const displayItems = computed(() => {
  let items = serviceStore.items
  let { categoryId, keyword } = store.formSearch
  keyword = keyword.trim().toLowerCase()

  if (!isNullish(categoryId)) {
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
    <section class="flex items-center p-3 border-b">
      <XSelect
        v-model="store.formSearch.categoryId"
        clearable ui-trigger="w-56 mr-2"
        placeholder="请选择服务组"
        @clear="handleClear('category')"
      >
        <XSelectItem
          v-for="item in serviceStore.groups"
          :key="item.categoryId"
          :value="item.categoryId"
          :label="item.category"
        />
      </XSelect>

      <XInput
        v-model="store.formSearch.keyword"
        clearable ui-root="w-64"
        placeholder="请输入关键词"
        @clear="handleClear('keyword')"
      />

      <hr class="h-6 w-px mx-4 bg-border" />

      <XButton
        label="新增"
        color="success"
        icon="lucide:circle-plus"
        @click="openCreate"
      />
    </section>

    <div class="p-3">
      <XTable
        :data="displayItems"
        :columns="columns"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <ItemDrawer />
  </div>
</template>
