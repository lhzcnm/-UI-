// import UnlockRecommendAction from '../components/UnlockRecommendAction.vue'

// import type { OrderTableView } from '@/api/orders'

// import { ORDER_STATUS, ORDER_STATUS_MAP } from '@3un/utils'
// import { XTag, type XTableColumn } from '@3un/ui'
// import { h } from 'vue'

// import { getLanuagestring } from "@/utils/constant"

// const iStore = useSystemStore()
// const localStore = useLocalStore()

// export function getDefaultColumns(): XTableColumn[] {
//   return [
//     {
//       key: 'index',
//       title: localStore.localData['submit_Index'],
//       align: 'center',
//       width: 64,
//       render: (_, __, index) => {
//         return index + 1
//       }
//     },
//     {
//       key: 'service',
//       title: localStore.localData['submit_ServiceTableHead'],
//       width: 220,
//       render: (_: any, row: OrderTableView) => {
//         if (!row || !row.serviceId) return localStore.localData['submit_ServicePlaceholderTable']
//         return `${row.serviceId} - ${row.serviceName}`
//       }
//     },
//     { key: 'imei', title: 'IMEI/SN', width: 158 },
//     { key: 'credits', title: localStore.localData['submit_PointTable'], width: 58 },
//     {
//       key: 'status',
//       title: localStore.localData['submit_OrderStatusTable'],
//       width: 108,
//       render: (value: ORDER_STATUS) => {
//         const id = value || ORDER_STATUS.WAIT
//         const tag = ORDER_STATUS_MAP[id]
//         return h(XTag, {
//           label: localStore.localData[tag.key!],
//           color: tag.color,
//         })
//       }
//     },
//     {
//       key: 'result',
//       title: localStore.localData['submit_OrderResultTable'],
//       minWidth: 320,
//       tdClassName: 'leading-6 py-1',
//       isColDel: true,
//       render: (value: string) => {
//         return h('span', { innerHTML: value })
//       },
//     },
//     {
//       key: 'recommends',
//       title: getLanuagestring("unlock_recommend_column", iStore.lang),
//       width: 238,
//       isColDel: true,
//       render(_, row: OrderTableView) {
//         if (!row.isStorage && (!row.recommends || row.recommends.length === 0 || row.status !== ORDER_STATUS.SUCCESS)) {
//           return getLanuagestring("no_unlock_recommend", iStore.lang)
//         }
//         return h(UnlockRecommendAction, {
//           order: row,
//         })
//       }
//     },
//     { key: 'remark', title: localStore.localData['submit_RemarkTable'], minWidth: 160, isColDel: true, isFilter: true },
//   ]
// }

// export function getDefaultResultColumns(): XTableColumn {
//   return {
//     key: 'result',
//     title: localStore.localData['submit_OrderResultTable'],
//     minWidth: 320,
//     tdClassName: 'leading-6 py-1',
//     isColDel: true,
//     render: (value: string) => {
//       return h('span', { innerHTML: value })
//     },
//   }
// }
