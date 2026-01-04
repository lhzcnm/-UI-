<script setup lang="ts">
import ServerFormBase from './ServerFormBase.vue'

import { toast } from 'vue-sonner'

import { updateMonitorServer } from '@/api/monitor'
import { MONITOR_SERVER_STORE } from '../utils'
import { validate, type ValidRule } from '@/utils'

const store = inject(MONITOR_SERVER_STORE)!

function getRules() {
  const { serverIp, serverName, domain, domainName } = store.formBase

  const rules: ValidRule[] = [
    {
      rule: !!serverIp,
      message: "请输入服务器IP",
    },
    {
      rule: !!serverName,
      message: "请输入服务器名称",
    },
    {
      rule: !!domain,
      message: "请输入监控订单后端域名",
    },
    {
      rule: !!domainName,
      message: "请输入服务器对应的公众号名称",
    },
  ]

  return rules
}

async function handleSubmit() {
  const rules = getRules()
  if (!validate(rules)) return
  
  try {
    await updateMonitorServer({
      ...store.formBase,
      domainId: store.domainId!,
      serverId: store.serverId!,
    })

    toast.success("更新成功")
    store.visibleBase = false
    store.refresh = !store.refresh
  } catch {
    toast.warning("更新失败")
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    title="编辑"
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 mb-0 border-b"
  >
    <template #default>
      <ServerFormBase class="p-4" v-model="store.formBase" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2 border-t">
        <XButton variant="soft" label="取消" @click="store.visibleBase = false" />
        <XButton label="保存" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>
