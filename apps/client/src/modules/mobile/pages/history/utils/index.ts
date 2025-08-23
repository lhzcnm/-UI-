import type { OrderExportForm, OrderSearchForm, OrderListResponse } from '@/api/orders'
import type { InjectionKey } from 'vue'
import { formatImeiType5 } from '@/utils'
import dayjs from 'dayjs'

export interface HistoryStore {
  orders: OrderListResponse
  searchForm: OrderSearchForm
  exportForm: OrderExportForm
  visibleSearch: boolean
  visibleExport: boolean
  visibleImg: boolean
}

type HistoryStoreKey = InjectionKey<HistoryStore>
export const HISTORY_STORE = Symbol('history-store') as HistoryStoreKey

interface Form {
  search: OrderSearchForm
  export: OrderExportForm
  orders: OrderListResponse
}

const searchForm: OrderSearchForm = {
  status: -1,
  serviceId: 0,
  imei: '',
  startTime: '',
  endTime: '',
}

export const form: Form = {
  search: searchForm,
  export: { ...searchForm },
  orders: { list: [], page: 1, total: 0, pageSize: 20 },
}

/**
 * 获取搜索订单参数
 * @param form 搜索表单
 * @returns 搜索参数
 */
export function formatOrderParams(form: OrderSearchForm) {
  const { status, startTime, endTime, imei } = form
  const imeiList = formatImeiType5(imei)
  const isAll = status === -1

  return {
    status: isAll ? undefined : status,
    imeiList: imeiList.length ? imeiList : undefined,
    startTime: startTime ? getStartTime(startTime) : undefined,
    endTime: endTime ? getEndTime(endTime) : undefined,
  }
}

export function getStartTime(date: string) {
  return dayjs(date).format('YYYY-MM-DD 00:00:00')
}

export function getEndTime(date: string) {
  return dayjs(date).format('YYYY-MM-DD 23:59:59')
}
