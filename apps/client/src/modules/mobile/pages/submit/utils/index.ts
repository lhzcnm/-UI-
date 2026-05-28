import type { Service, ServiceDetail } from '@/api/services'
import type { Order } from '@/api/orders'
import type { InjectionKey } from 'vue'

export interface SubmitStore {
  service: Service | undefined
  serviceId: number
  rawOrders: Order[]
  visible: boolean
  visibleHistory: boolean
  count: number
  serviceHeader: string[]
}

interface FindOptions {
  mode: 'children' | 'parent'  
  targetIds?: number[]         
  targetId?: number            
}

export function findNodes(data: ServiceDetail[], options: FindOptions) {
  if (options.mode === 'children' && options.targetIds) {
    // 获取子节点
    const idSet = new Set(options.targetIds)
    const result: ServiceDetail[] = []

    function traverse(nodes: ServiceDetail[]) {
      if (!nodes?.length) return
      for (const node of nodes) {
        if (idSet.has(node.id)) result.push(node)
        if (node.children?.length) traverse(node.children as any
        )
      }
    }
    traverse(data)
    return result
  }

  if (options.mode === 'parent' && options.targetId) {
    // 获取父id
    for (const item of data) {
      if (item.children?.some(child => child.id === options.targetId)) {
        return item.id
      }
    }
    return null
  }

  return null
}

type SubmitStoreKey = InjectionKey<SubmitStore>
export const SUBMIT_STORE = Symbol('submitStore') as SubmitStoreKey
