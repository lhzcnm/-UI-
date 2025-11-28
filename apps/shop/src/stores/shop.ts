import { getServices } from "@/api/shop"
import { type OrderSearchForm, type Order, type SubmitParams, zSubmitParams } from "@/inters/order"
import { type ServiceDetail, type Service } from "@/inters/services"
import { createList } from "@/utils/common"
import type { IList } from "@3un/shared"
import { defineStore } from "pinia"

export const useShopStore = defineStore("shop", () => {
  const selService = ref<Service | undefined>(undefined)
  const services = ref<ServiceDetail[]>([])
  const createOrder = ref<SubmitParams>(zSubmitParams.parse({}))

  const historys = reactive<IList<Order>>(createList())
  const historySearch = reactive<OrderSearchForm>({
    page: 1,
    pageSize: 20,
  })

  const servicesMap: Map<number, Service> = new Map<number, Service>()

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
    createOrder,
    servicesMap,
    historys,
    historySearch,

    getServiceList,
  }
})
