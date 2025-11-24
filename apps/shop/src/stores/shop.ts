import { getServices } from "@/api/shop"
import { type OrderSearchForm, type Order } from "@/inters/order"
import { type ServiceDetail, type Service } from "@/inters/services"
import { createList } from "@/utils/common"
import type { IList } from "@3un/shared"
import { defineStore } from "pinia"

export const useShopStore = defineStore("shop", () => {
  const selService = ref<Service | undefined>(undefined)
  const services = ref<ServiceDetail[]>([])
  const servicesMap: Map<number, Service> = new Map<number, Service>()
  const historys = reactive<IList<Order>>(createList())
  const historySearch = reactive<OrderSearchForm>({
    page: 1,
    pageSize: 20,
  })

  async function getServiceList() {
    const data = await getServices()
    services.value = data

    for(let group of data) {
      for(let service of group.children) {
        servicesMap.set(service.id, service)
      }
    }
  }

  return {
    selService,
    services,
    servicesMap,
    historys,
    historySearch,

    getServiceList,
  }
})
