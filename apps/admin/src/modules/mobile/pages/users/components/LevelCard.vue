<script setup lang="ts">
import { zLevelForm, zLevelServiceForm, type Level } from '@/inters/level'
import type { XTagProps } from '@3un/ui'

import { LEVEL_STORE } from '../utils'
import { deleteLevel, getLevelServices } from '@/api/level'
import { xconfirm } from '@3un/utils'

interface TheProps {
  level: Level
  index: number
}

const props = defineProps<TheProps>()
const store = inject(LEVEL_STORE)!

const levelStore = useLevelStore()

const status = computed<XTagProps>(() => {
  const status = props.level.disablePricePlan
  return {
    color: status ? 'danger' : 'success',
    label: status ? '禁用' : '启用',
  }
})

function handleSubmit() {
  store.formBase = zLevelForm.parse(props.level)
  store.index = props.index
  store.visibleBase = true
}

async function openService() {
  await getServices()

  const planId = props.level.pricePlanId
  store.formService = zLevelServiceForm.parse({
    planId,
  })

  store.index = props.index
  store.visibleService = true
}

async function getServices() {
  const levelId = props.level.pricePlanId
  const response = await getLevelServices(levelId)
  store.services = response
}

async function handleDelete() {
  if (!await xconfirm('确定删除该等级吗？')) return
  await deleteLevel(props.level.pricePlanId)
  levelStore.levels.splice(props.index, 1)
}
</script>

<template>
  <button
    class="w-full text-left bg-card rounded-lg border overflow-hidden"
    @click="handleSubmit"
  >
    <div class="flex items-center justify-between p-3">
      <div class="flex-1">
        <span class="bg-primary/10 px-2 py-1 mr-2 rounded-md text-sm text-primary">{{ level.pricePlanId }}</span>
        <span class="text-sm">{{ level.pricePlan }} | {{ level.pricePlanLocal }}</span>
      </div>
      <XTag v-bind="status" />
    </div>

    <div class="flex items-center justify-between px-3 py-2 border-t border-dashed">
      <div class="flex-1 space-x-2 text-sm text-muted-foreground">
        <span>设备页面({{ level.enableDevice ? '启用' : '禁用' }})</span>
      </div>

      <div class="flex space-x-2">
        <XButton size="sm" icon="lucide:edit" label="编辑服务" @click.stop="openService" />
        <XButton size="sm" icon="lucide:trash-2" color="danger" label="删除" @click.stop="handleDelete" />
      </div>
    </div>
  </button>
</template>
