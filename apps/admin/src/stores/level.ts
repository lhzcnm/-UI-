import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { Level } from '@/inters/level'
import { getLevels } from '@/api/level'
import { useFetchWithCache } from '@3un/utils'

export const useLevelStore = defineStore('level', () => {
  const levels = useStorage<Level[]>('levels', [], sessionStorage)
  const levelMap = ref(new Map<number, Level>())

  async function getList(force = false) {
    const data = await useFetchWithCache({
      fetchFn: getLevels,
      key: 'levels',
      force,
    })

    levelMap.value.clear()
    levelMap.value = new Map(
      data.map(item => [item.pricePlanId, item])
    )

    levels.value = data
  }

  return {
    levels,
    levelMap,
    getList,
  }
})
