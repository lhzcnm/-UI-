<script setup lang="ts">
import OssUpload from './components/OssUpload.vue'

import type { IPage } from '@3un/shared'
import type { XTableExpose } from '@3un/ui'

import { getOssDataList } from '@/api/oss'
import { createList } from '@/utils'
import { columns } from './utils/column'
import { OSS_STORE, type OssStore } from './utils'

const store = reactive<OssStore>({
  visibleUpdate: false,

  ossData: createList(),

  page: 1,
  pageSize: 20,
  refresh: false,
})
provide(OSS_STORE, store)

const loading = ref<boolean>(false)

const tableRef = ref<XTableExpose | null>(null)

watch(
  ([() => store.page, () => store.pageSize, () => store.refresh]),
  async ([pageVal, sizeVal]) => {
    await getList({
      page: pageVal,
      pageSize: sizeVal
    })
  },
  { immediate: true }
)

watch(
  (() => store.pageSize),
  () => store.page = 1
)

async function getList(params: IPage) {
  loading.value = true
  const data = await getOssDataList(params)
  store.ossData = data
  tableRef.value?.scrollToTop()
  loading.value = false
  // console.log(data)
}

function openUpdate() {
  store.visibleUpdate = true
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center space-x-4">
        <XButton label="更新oss" icon="lucide:cloud-upload" @click="openUpdate" />
        <XButton label="刷新" icon="lucide:refresh-ccw" color="warning" @click="store.refresh = !store.refresh" />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.pageSize"
        :total="store.ossData.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>

    <div class="p-3 pb-0">
      <XTable
        class="border h-[calc(100vh-8.75rem)]"
        ref="tableRef"
        :columns="columns"
        :data="store.ossData.list"
        :loading="loading"
      />
    </div>

    <OssUpload />
  </div>
</template>
