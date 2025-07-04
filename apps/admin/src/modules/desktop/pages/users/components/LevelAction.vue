<script setup lang="ts">
import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/utils'

import type { Level } from '@/inters/level'
import { zLevelForm, zLevelServiceForm } from '@/inters/level'
import { deleteLevel, getLevelServices } from '@/api/level'

import { LEVEL_STORE } from '../utils'

interface LevelActionProps {
  index: number
  row: Level
}

const props = defineProps<LevelActionProps>()

const store = inject(LEVEL_STORE)!
const levelStore = useLevelStore()

const options: XBtnSplitOptions = [
  { label: '服务价格', icon: 'lucide:coins', command: openService },,
  { label: '永久删除', icon: 'lucide:trash-2', command: handleDelete },
]

function openUpdate() {
  store.formBase = zLevelForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function openService() {
  await getServices()

  store.formService = zLevelServiceForm.parse({
    planId: props.row.pricePlanId,
  })

  store.index = props.index
  store.visibleService = true
}

async function getServices() {
  const levelId = props.row.pricePlanId
  const response = await getLevelServices(levelId)
  store.services = response
}

async function handleDelete() {
  if (!await xconfirm('确定删除该等级吗？')) return
  await deleteLevel(props.row.pricePlanId)
  levelStore.levels.splice(props.index, 1)
}
</script>

<template>
  <XButtonSplit
    :options="options"
    label="编辑" size="sm"
    @click="openUpdate"
  />
</template>
