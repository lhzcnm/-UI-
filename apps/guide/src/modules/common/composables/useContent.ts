import { ref } from 'vue'
import { getDocxInfo, QueryType } from '@/utils/api'
import type { ContentItem } from '../types'

export function useContent() {
  const contentList = ref<ContentItem[]>([])
  const loading = ref(false)

  async function loadContent(serviceCode: string) {
    if (!serviceCode) return
    loading.value = true
    // 清理动态图片容器（移动端使用）
    document.querySelectorAll('.image-gallery-container').forEach(el => el.remove())
    try {
      const data = await getDocxInfo([{
        serviceCode,
        queryType: QueryType.Prefix
      }])
      // const data = response?.data?.data || response?.data || response || []
      contentList.value = data.map((item: any) => ({
        value: item.serviceCode,
        content: item.serviceDesc || '',
        images: item.images || []
      }))
    } catch (error) {
      console.error(`加载失败 (${serviceCode}):`, error)
      contentList.value = []
    } finally {
      loading.value = false
    }
  }

  return { contentList, loading, loadContent }
}