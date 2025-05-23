<script setup lang="ts">
import type { Level } from '@/inters/level'
import { zLevelForm } from '@/inters/level'

import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/utils'
import { LEVEL_STORE } from '../utils'
import { deleteLevel } from '@/api/level'

interface LevelActionProps {
  index: number
  row: Level
}

const props = defineProps<LevelActionProps>()

const store = inject(LEVEL_STORE)!
const levelStore = useLevelStore()

const options: XBtnSplitOptions = [
  { label: '服务价格', icon: 'lucide:coins' },,
  { label: '永久删除', icon: 'lucide:trash-2', command: handleDelete },
]

function openUpdate() {
  store.formBase = zLevelForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
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
