import http from "@/utils/http"
import type { priceFilter, PriceFilter, searchParamsType } from "../utils/quoteType"


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

// 远望新机报价单筛选的接口
export async function NewPriceFilter(params:PriceFilter){
  const { data } = await http.post('/newQuotation/filter',params)
  return data 
}

// 报价单筛选的接口重置价格
export async function PriceRefresh() {
  const { data } = await http.delete(`/quotation/refresh`)
  return data
}

//生成报价单的图表
export async function Quotation(type: number) {
  const { data } = await http.get(`/quotation/${type}`)
  return data
}

//远望新机价
export async function newQutation() {
  const { data } = await http.get('/newQuotation/list')
  return data
}

//搜索报价
//搜索的类型
export async function serachType() {
  const { data } = await http.get('/quotation/options')
  return data
}

//远望新机的搜索类型
export async function newSearchType() {
  const { data } = await http.get('/newQuotation/options')
  return data
}

//搜索的接口
export async function priceSearch(params:searchParamsType){
  const { data } = await http.post('/quotation/select', params)
  return data
}

//新机的搜索
export async function newPriceSearch(params:searchParamsType) {
  const { data } = await http.post('/newQuotation/select',params)
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