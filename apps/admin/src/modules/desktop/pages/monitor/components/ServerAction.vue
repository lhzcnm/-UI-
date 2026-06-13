<script setup lang="ts">
import { zMonitorForm, type MonitorServer } from '@/inters/monitor/server'
import { MONITOR_SERVER_STORE } from '../utils'
import { getCode } from '@/api/domain';
import { toast } from 'vue-sonner';

interface ServerActionProps {
  row: MonitorServer
}

const { row } = defineProps<ServerActionProps>()

const store = inject(MONITOR_SERVER_STORE)!

const loading = ref<boolean>(false)

function openUpdate() {
  store.formBase = zMonitorForm.parse(row)
  store.domainId = row.domainId
  store.visibleBase = true
}

async function AuthNoPwd() {
  if (loading.value) return

  const newWin = window.open('about:blank')
  try {
    loading.value = true
    const code = await getCode({ domainId: row.domainId })

    toast.success('获取认证成功, 为您跳转')

    if (newWin) {
      let frontDomain = `adminx${row.frontDomain}`
      if (!frontDomain.endsWith('/')) {
        frontDomain += '/'
      }

      newWin.location.href = `http://${frontDomain}auth-code?code=${code}`
    }
  } catch {
    newWin?.close()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <XButton
      label="编辑"
      size="sm"
      icon="lucide:edit"
      @click="openUpdate"
    />
    <XButton
      label="后台登录"
      size="sm"
      icon="lucide:app-window-mac"
      color="warning"
      @click="AuthNoPwd"
    />
  </div>
</template>
