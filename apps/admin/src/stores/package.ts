import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { RechargePackage } from '@/inters/recharge'
import { getRechargePackages } from '@/api/recharge'
import { useFetchWithCache } from '@3un/utils'

export const usePackageStore = defineStore('package', () => {
  const packages = useStorage<RechargePackage[]>('packages', [], sessionStorage)
  const packageMap = ref(new Map<number, RechargePackage>())

  async function getList(force = false) {
    const data = await useFetchWithCache({
      fetchFn: getRechargePackages,
      key: 'packages',
      force,
    })

    packageMap.value.clear()
    packageMap.value = new Map(
      data.map(item => [item.id, item])
    )

    packages.value = data
  }

  return {
    packages,
    packageMap,
    getList,
  }
})
