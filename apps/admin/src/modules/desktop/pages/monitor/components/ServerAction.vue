<script setup lang="ts">
import { zMonitorForm, type MonitorServer } from '@/inters/monitor/server'
import { MONITOR_SERVER_STORE } from '../utils'

interface ServerActionProps {
  row: MonitorServer
}

const { row } = defineProps<ServerActionProps>()

const store = inject(MONITOR_SERVER_STORE)!

function openUpdate() {
  store.formBase = zMonitorForm.parse(row)
  store.serverId = row.serverId
  store.domainId = row.domainId
  store.visibleBase = true
}
</script>

<template>
  <XButton
    label="编辑"
    size="sm"
    icon="lucide:edit"
    @click="openUpdate"
  />
</template>
