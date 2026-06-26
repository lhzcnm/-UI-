<script setup lang="ts">
import VoucherCard from './components/VoucherCard.vue'
import VoucherCreate from './components/VoucherCreate.vue'

import { createList, defaultPageSize } from '@/utils'
import { VOUCHER_STORE, type VoucherStore } from './utils'
import { deleteVoucher, getVouchers } from '@/api/voucher'
import { zVoucherCreate, type VoucherListForm } from '@/inters/voucher'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

const store: VoucherStore = reactive({
  visibleCreate: false,
  visibleUpdate: false,
  refresh: false,

  vouchers: createList(),
  createForm: zVoucherCreate.parse({}),

  page: 1,
  limit: defaultPageSize,
})

provide(VOUCHER_STORE, store)

const loading = ref(false)

const containerRef = ref<HTMLElement | null>(null)

watch(
  (
    [
      () => store.page,
      () => store.refresh,
    ]
  ),
  async ([pageVal]) => {
    await getVoucherList({
      page: pageVal,
      pageSize: store.limit,
    })
  },
  {
    immediate: true,
  }
)

async function getVoucherList(body: VoucherListForm) {
  try {
    loading.value = true
    const data = await getVouchers(body)
    containerRef.value?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    store.vouchers = data
  } finally {
    loading.value = false
    store.refresh = false
    store.createForm = zVoucherCreate.parse({})
  }
}

async function handleDelete(id: number) {
  if (!id) return

  if (!await xconfirm("是否确认删除")) return

  try {
    await deleteVoucher([id])
    const index = store.vouchers.list.findIndex(v => v.id === id)

    if (index !== -1) {
      store.vouchers.list.splice(index, 1)
      toast.success("删除成功")
    }
  } catch {
    toast.warning("删除失败, 请重试")
  }
}
</script>

<template>
  <div ref="containerRef">
    <!-- <Toolbar :loading="loading">
      <template #default>
        <XSimplePagination
          v-model="store.page"
          :limit="store.limit"
          :total="store.vouchers.total"
        />
      </template>

      <template #extra>
        <XButton
          icon="lucide:ticket-plus"
          label="生成券码"
          @click="store.visibleCreate = true"
        />
      </template>
    </Toolbar> -->

    <section class="sticky top-0 flex">
      <div class="relative z-10 flex-1 flex justify-between px-3 py-2 border-b bg-card">
        <XButton
          icon="lucide:ticket-plus"
          label="生成券码"
          @click="store.visibleCreate = true"
        />
        <XSimplePagination
          v-model="store.page"
          :limit="store.limit"
          :total="store.vouchers.total"
        />
      </div>
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.vouchers.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <VoucherCard
          v-for="voucher in store.vouchers.list" :key="voucher.id"
          :id="voucher.id" :code="voucher.code" :amount="voucher.amount"
          :expire-ts="voucher.expireTs" :create-time="voucher.createTime"
          :status="voucher.status" :user-id="voucher.userId" :use-time="voucher.useTime"
          :credit-type="voucher.creditsUsageType" :type="voucher.type"
          @delete="handleDelete"
        />
      </template>
    </section>

    <VoucherCreate />
  </div>
</template>
