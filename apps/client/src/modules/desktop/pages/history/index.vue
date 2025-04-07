<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'

import { orderApi } from '@/api/orders'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import type { Order } from '@/api/orders'
import type { TableColumn } from '@3un/ui'
import { XTag, XButton } from '@3un/ui'
import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERTIFY, ORDER_VERTIFY_MAP } from '@3un/shared/enums'



import { toast } from 'vue-sonner'
import { useClipboard, useThrottleFn } from '@vueuse/core'

import { stripHtml } from '@3un/utils'


const serviceStore = useServiceStore()
const page = ref(1)
const pageSize = ref(20)

const store: HistoryStore = reactive({
  orders: { list: [], page: 1, total: 0, pageSize: 20 },
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
})

provide(HISTORY_STORE, store)

watch(
  [page, pageSize],
  async ([pageVal, pageSizeVal]) => {
      await Promise.all([
        serviceStore.getServices(),
        (async () => {
          const params = formatOrderParams(store.searchForm);
          const response = await orderApi.list({
            pageSize: pageSizeVal,
            page: pageVal,
            ...params,
          });
          store.orders = response.data;
        })(),
      ]);  
  },
  { immediate: true }
);

function openSearch() {
  store.visibleSearch = true
}

function openExport() {
  store.exportForm = { ...form.export }
  store.visibleExport = true
}

const columns: TableColumn[] = [
  { key: 'id', title: 'ID', width: 108 },
  {
    key: 'service',
    title: '服务',
    render: (_: any,row: Order) => {
      const service = serviceStore.services.get(row.serviceId)

      if (!service) return '未知'
      return `${service.id} - ${service.title}`
    },
},
  { key: 'imei', title: 'IMEI/SN', width: 164 },
  { key: 'credits', title: '积分', width: 88 },
  {
    key: 'status',
    title: '订单状态',
    width: 128,
    render: (value: any) => {
      const tag = ORDER_STATUS_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label,
      })
    },
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 128,
    render: (value: any) => {
      const tag = ORDER_VERTIFY_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label,
      })
    },
  },
  {
    key: 'result',
    title: '订单结果',
    flex: true,
    width: 300, 
    tdClassName: 'leading-6 py-1',
    render: (value: any) => {
      return h('div', { innerHTML: value })
    },
  },
  { key: 'remark', title: '备注', width: 180 },
  {
  key: 'action',
  title: '操作',
  fixed: 'right',
  width: 280,
  render: (_: any, row: Order) => {

    const status = {
      isSuccess: row.status === ORDER_STATUS.SUCCESS,
      isFailed: row.status === ORDER_STATUS.FAILED,
      isProcessing: row.status === ORDER_STATUS.PROCESSING,
      isWait: row.status === ORDER_STATUS.WAIT,
    };

    const verify = {
      isNormal: row.verify === ORDER_VERTIFY.NORMAL,
      isReplied: row.verify === ORDER_VERTIFY.REPLIED,
      isSolved: row.verify === ORDER_VERTIFY.SOLVED,
      isRefunded: row.verify === ORDER_VERTIFY.REFUNDED,
    };

    const focreHide = ref(false);
    const { copy, copied } = useClipboard({ legacy: true });

    watch(copied, (value) => value && toast.success('复制成功'));

    const handleRefresh = useThrottleFn(() => {
      orderApi.item(row.id).then(({ data }) => {
        toast.success('刷新成功');
        const index = store.orders.list.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          store.orders.list[index] = {
            ...store.orders.list[index],
            result: data.result,
          };
        }
      });
    }, 500);

    const handleVerify = () => {
      orderApi.verify(row.id).then(() => {
        toast.success('已提交验证');
        focreHide.value = true;
        const index = store.orders.list.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          store.orders.list[index] = {
            ...store.orders.list[index],
            verify: ORDER_VERTIFY.REPLIED,
          };
        }
      });
    };

    const handleCopy = () => {
      const items = row.result.split('<br>');
      copy(items.map(stripHtml).join('\n'));
    };

    return h(
      'div',
      { class: 'space-x-1 pt-1' },
      [        
        h(XButton,{
          color: 'emerald',          
          label: '复制结果',          
          size: 'sm',          
          onClick: handleCopy,        
        }),        
        verify.isNormal && status.isSuccess && !focreHide.value          
        ? h(XButton, {              
          variant: 'outline',              
          color: 'amber',              
          label: '开启验证',              
          size: 'sm',              
          onClick: handleVerify,            
        })          
        : null,        
        status.isProcessing          
        ? h(XButton, {              
          label: '刷新',              
          size: 'sm',              
          onClick: handleRefresh,            
        })          
        : null,      
      ].filter(Boolean), 
    );
  },
},
]
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <XButton label="搜索" @click="openSearch" />
        <XButton color="emerald" label="导出" @click="openExport" />
      </div>

      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="store.orders.total"
        :layouts="[
          'total',
          'sizes',
          'prev',
          'pager',
          'next',
          'jumper',
        ]"
      />
    </section>

    <XTable
      :data="store.orders.list"
      :columns="columns"
      row-key="id"
      class="h-[calc(100%-3rem)]"
    />

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
