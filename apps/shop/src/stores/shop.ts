import { type OrderSearchForm, type Order } from "@/inters/order"
import type { Service } from "@/inters/services"
import { createList } from "@/utils/common"
import type { IList } from "@3un/shared"
import { defineStore } from "pinia"

export const useShopStore = defineStore("shop", () => {
  const selService = ref<Service | undefined>(undefined)
  const historys = reactive<IList<Order>>(createList())
  const historySearch = reactive<OrderSearchForm>({
    page: 1,
    pageSize: 20,
  })

  return {
    selService,
    historys,
    historySearch,
  }
})
