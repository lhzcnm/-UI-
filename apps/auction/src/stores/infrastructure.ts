import { getCapacities, getColors, getGrades, getLocks, getModels } from '@/api/infrastructure'
import { defineStore } from 'pinia'

export const useInfrastructure = defineStore('infrastructure', () => {
  const models = ref<string[]>([])
  const colors = ref<string[]>([])
  const capacities = ref<string[]>([])
  const grades = ref<string[]>([])
  const locks = ref<string[]>([])
  
  async function getModelList() {
    try {
      models.value = await getModels()
    } catch {}
  }

  async function getColorList() {
    try {
      colors.value = await getColors()
    } catch {}
  }

  async function getCapacitList() {
    try {
      capacities.value = await getCapacities()
    } catch {}
  }

  async function getGradeList() {
    try {
      grades.value = await getGrades()
    } catch {}
  }

  async function getLockList() {
    try {
      locks.value = await getLocks()
    } catch {}
  }
  
  async function getDefaultInfrastructure() {
    await Promise.all([
      getModelList(),
      getColorList(),
      getCapacitList(),
      getGradeList(),
      getLockList(),
    ])
  }

  return {
    models,
    colors,
    capacities,
    grades,
    locks,

    getDefaultInfrastructure,
  }
})
