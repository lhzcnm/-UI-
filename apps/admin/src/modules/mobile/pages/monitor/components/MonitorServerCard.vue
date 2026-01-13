<script setup lang="ts">
import { zMonitorForm, type MonitorServer } from '@/inters/monitor/server'
import { MONITOR_SERVER_STORE } from '../utils'

interface MonitorServerCardProps {
  server: MonitorServer,
}

const props = defineProps<MonitorServerCardProps>()

const store = inject(MONITOR_SERVER_STORE)!

function openUpdate() {
  store.serverId = props.server.serverId
  store.domainId = props.server.domainId
  store.formBase = zMonitorForm.parse(props.server)
  store.visibleBase = true
}
</script>

<template>
  <div
    class="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2 text-lg font-medium text-foreground">
        {{ server.serverName }}
      </div>
      <div class="text-xs text-muted-foreground">#{{ server.serverId }}</div>
    </div>

    <div class="text-sm flex flex-col gap-1 text-muted-foreground mt-1">
      <div class="flex items-center gap-2">
        <span>IP：</span>
        <span class="text-foreground">{{ server.serverIp }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span>域名：</span>
        <span class="text-foreground">{{ server.domain }}</span>
      </div>
    </div>

    <div class="mt-2 border-t border-border pt-2 text-sm flex items-center justify-between">
      <div class="text-muted-foreground">
        公众号：
        <span class="text-foreground">{{ server.domainName }}</span>
      </div>
      <div class="flex items-center">
        <XButton size="sm" label="编辑" @click="openUpdate" />
      </div>
    </div>
  </div>
</template>
