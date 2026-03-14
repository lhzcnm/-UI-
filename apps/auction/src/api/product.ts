import { zProduct, type ExcelUpdate, type ProductCreate, type ProductExport, type ProductRecords, type ProductSearchParams, type ProductUpdate } from '@/inters/product'
import http from '@/utils/http'
import type { AxiosResponse } from 'axios'

export async function importUpdateRecord(body: FormData): Promise<void> {
  await http.post('product/import', body)
}

export async function importCreateHistory(body: FormData): Promise<number> {
  const { data } = await http.post('excel/import', body)
  return data
}

export async function getProductRecords(params: ProductSearchParams): Promise<ProductRecords> {
  const { data } = await http.get<ProductRecords>('product/page', { params })
  return { ...data, list: data.list.map(p => zProduct.parse(p)) }
}

export async function createProductRecord(body: ProductCreate[]): Promise<void> {
  await http.post('product/batch/saveOrUpdate', body)
}

export async function updateProductRecord(body: ProductUpdate[]): Promise<void> {
  await http.post('product/batch/saveOrUpdate', body)
}

export async function exportProductRecord(body: ProductExport): Promise<AxiosResponse> {
  return await http.post<string>('excel/export', body, { responseType: 'blob' })
}

export async function deleteProduct(ids: number[]): Promise<void> {
  return await http.delete('product', { data: ids })
}

export async function updateProductPrice(body: ExcelUpdate): Promise<void> {
  await http.post('excel/update', body)
}
