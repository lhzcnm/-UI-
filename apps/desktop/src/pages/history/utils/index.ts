import type { OrderExportForm, OrderSearchForm, OrderListResponse } from '@3un/shared/orders'
import type { InjectionKey } from 'vue'
import dayjs from 'dayjs'

export interface HistoryStore {
  orders: OrderListResponse
  searchForm: OrderSearchForm
  exportForm: OrderExportForm
  visibleSearch: boolean
  visibleExport: boolean
}

type HistoryStoreKey = InjectionKey<HistoryStore>
export const HISTORY_STORE = Symbol('history-store') as HistoryStoreKey

interface Form {
  search: OrderSearchForm
  export: OrderExportForm
}

const searchForm: OrderSearchForm = {
  status: 'all',
  verify: 'all',
  serviceId: 0,
  imei: '',
  date: ['', ''],
}

export const form: Form = {
  search: searchForm,
  export: { ...searchForm },
}

/**
 * 获取搜索订单参数
 * @param form 搜索表单
 * @returns 搜索参数
 */
export function getSearchOrderParams(form: OrderSearchForm) {
  const { serviceId, status, date, imei } = form
  const imeiList = imei.split('\n').filter(Boolean)
  const startTime = date[0] ? dayjs(date[0]).format('YYYY-MM-DD 00:00:00') : undefined
  const endTime = date[1] ? dayjs(date[1]).format('YYYY-MM-DD 23:59:59') : undefined
  const isAll = status === 'all'

  return {
    serviceId: serviceId || undefined,
    status: isAll ? undefined : status,
    imeiNo: imeiList.length ? imeiList : undefined,
    startTime,
    endTime,
  }
}
