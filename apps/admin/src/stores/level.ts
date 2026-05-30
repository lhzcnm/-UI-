import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { Level } from '@/inters/level'
import { getLevels } from '@/api/level'
import { useFetchWithCache } from '@3un/utils'

export const useLevelStore = defineStore('level', () => {
  const levels = useStorage<Level[]>('levels', [], sessionStorage)
  const levelMap = ref(new Map<number, Level>())

  watch(
    () => levels.value,
    () => {
      levelMap.value.clear()
      levelMap.value = new Map(
        levels.value.map(item => [item.pricePlanId, item])
      )
    },
    { deep: true }
  )
  async function getList(force = false) {
    const data = await useFetchWithCache({
      fetchFn: getLevels,
      key: 'levels',
      force,
    })

    levels.value = data
  }

  return {
    levels,
    levelMap,
    getList,
  }
})
