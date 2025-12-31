<script setup lang="ts">
import RemarkDialog from './components/RemarkDialog.vue'
import SelectCategory from './components/SelectCategory.vue'
import SelectApiEnum from './components/SelectApiEnum.vue'

import { debounce, xconfirm } from '@3un/utils'

import { createList } from '@/utils'
import { REMARK_STORE, type RemarkStore } from './utils'
import { zRemarkForm, type RemarkSearchForm } from '@/inters/quotation/remark'
import { deleteRemark, getDeviceBrand, getRemarks } from '@/api/quotation'
import { columnsRemark } from './utils/columnsRemark'
import { toast } from 'vue-sonner'

const store: RemarkStore = reactive({
  visibleBase: false,
  refresh: false,

  searchForm: {
    page: 1,
    pageSize: 20,
    priceType: undefined,
    brand: undefined,
    model: '',
  },
  formBase: zRemarkForm.parse({}),

  id: undefined,
  remarks: createList(),
  brands: [],
  brandsMap: new Map<number, string>(),
})

provide(REMARK_STORE, store)

const loading = ref<boolean>(false)
const keyword = ref<string>('')
const selectedIds = ref<number[]>([])

watch(
  ([
    () => store.searchForm,
    () => store.refresh,
  ]),
  async ([form]) => {
    await getRemarkList({ ...form })
  },
  {
    immediate: true,
    deep: true,
  }
)

async function getRemarkList(params: RemarkSearchForm) {
  loading.value = true
  const data = await getRemarks(params)
  store.remarks = data
  loading.value = false
}

async function getBrandList() {
  const data = await getDeviceBrand()
  
  store.brands = data
  for(const item of data) {
    store.brandsMap.set(item.code, item.descCn)
  }
}

function openCreate() {
  store.formBase = zRemarkForm.parse({})
  store.visibleBase = true
}

async function handleDelete() {
  if(!await xconfirm('确定删除选中的数据?')) return

  deleteRemark(selectedIds.value).then(() => {
    toast.success('删除成功')
    store.refresh = !store.refresh
  }).catch(() => {
    toast.error('删除失败, 请重试')
  })
}

await Promise.all([
  getBrandList(),
])

const handleInput = debounce(() => {
  store.searchForm.model = keyword.value
})
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center space-x-2">
        <SelectCategory v-model="store.searchForm.priceType" />
        <SelectApiEnum class="min-w-40" :api-enums="store.brands" v-model="store.searchForm.brand" />

        <XInput
          ui-root="min-w-80" placeholder="请输入设备型号"
          clearable
          v-model="keyword" @input="handleInput"
        />


        <XButton
          label="新增报价单"
          color="success"
          icon="lucide:plus"
          @click="openCreate"
        />

        <XButton
          label="批量删除"
          icon="lucide:trash-2"
          variant="outline"
          color="danger"
          @click="handleDelete"
        />
      </div>

      <XPagination
        v-model="store.searchForm.page"
        v-model:limit="store.searchForm.pageSize"
        :total="store.remarks.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
        ]"
      />
    </section>

    <div class="p-3 pb-0">
      <XTable
        ref="tableRef"
        :loading
        :data="store.remarks.list"
        :columns="columnsRemark"
        selected-key="id"
        selection
        @select-change="selectedIds = $event"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>
    
    <RemarkDialog />
  </div>
</template>
