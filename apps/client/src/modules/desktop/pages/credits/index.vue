<script setup lang="ts">
import { userApi } from '@/api/user';
import type { CreditLogsResponse, CreditLogItem } from '@/api/user';
import type { TableColumn } from '@3un/ui';

const page = ref(1);
const pageSize = ref(20);

const loading = ref(false);
const creditLogs = ref<CreditLogsResponse>();


watch(
  [page, pageSize],
  async ([pageVal, pageSizeVal]) => {
    loading.value = true

    const response = await userApi.creditLogs({
      pageSize: pageSizeVal,
      page: pageVal,
    })

    creditLogs.value = response.data
    loading.value = false
  },
  { immediate: true },
)

const columns: TableColumn[] = [
  {
    key: 'service',
    title: '项目',
    width: 220,
    render: (_: any, row: CreditLogItem) => {
      if (!row) return '-';
      if (row.packageId) {
        const id = row.packageId ?? 0;
        const title = row.packageTitle ?? '找不到服务';
        return `${id} - ${title}`;
      }
      return '积分充值';
    },
  },
  {
    key: 'imeiNo',
    title: 'IMEI',
    width: 180,
  },
  {
    key: 'credits',
    title: '变动金额',
    width: 108,
    render: (_: any, row: CreditLogItem) => {
      if (!row) return '-';
      const isSubmit = row.description.includes('订单提交');
      const value = isSubmit ? `-${row.credits}` : `+${row.credits}`;
      const color = isSubmit ? 'text-rose-500' : 'text-emerald-500';
      return h('span', { class: color }, value);
    },
  },
  {
    key: 'creditsLeft',
    title: '余额',
    width: 64,
  },
  {
    key: 'description',
    title: '变更原因',
    width: 220,
  },
  {
    key: 'historyDtTm',
    title: '变更时间',
    width: 180,
  },
  {
    key: 'ip',
    title: 'IP',
    width: 180,
  },
  {
    key: 'comments',
    title: '备注',
    width: 180,
    flex: true,
  },
];
</script>

<template>
  <div class="p-4 h-full">
    <section class="space-x-2 mb-3">
      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="creditLogs?.total ?? 0"
        :layouts="['total', 'sizes', 'prev', 'pager', 'next', 'jumper']"
      />
    </section>

    <XTable
      v-if="creditLogs && !loading"
      :data="creditLogs.list"
      :columns="columns"
      row-key="historyId"
      class="h-[calc(100%-3rem)]"
    />
  </div>
</template>