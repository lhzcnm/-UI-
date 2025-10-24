import http from "@/utils/http"
import type { priceFilter, searchParamsType } from "../utils/quoteType"


// 热门机型接口
export async function HotModel(type?: string) {
  const { data } = await http.get(`/quotation/hot-model`, { params: { model: type } })
  return data
}

// 报价单筛选的接口
export async function PriceFilter(params:priceFilter) {
  const { data } = await http.post(`/quotation/filter/${params.type}`,params)
  return data
}

// 报价单筛选的接口重置价格
// export async function PriceRefresh(params:priceFilter) {
//   const { data } = await http.post(`/quotation/filter/${params.type}`,params)
//   return data
// }

//生成报价单的图表
export async function Quotation(type: number) {
  const { data } = await http.get(`/quotation/${type}`)
  return data
}

//搜索报价
//搜索的类型
export async function serachType() {
  const { data } = await http.get('/quotation/options')
  return data
}

//搜索的接口
export async function priceSearch(params:searchParamsType){
  const { data } = await http.post('/quotation/select', params)
  return data
}

//免费次数接口
export async function freeGenerate(){
  const { data } = await http.post('/quotation/pay')
  return data
}

//免费次数不足就扣除积分接口
export async function deductPoints() {
  const { data } = await http.post('/quotation/payCredit')
  return data
}