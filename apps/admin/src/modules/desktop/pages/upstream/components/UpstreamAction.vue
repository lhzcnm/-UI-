<script setup lang="ts">
import { API_TYPE } from '@3un/utils'

import type { UpstreamCreateParams, Upstream } from '@/inters/upstream'
import { zUpstreamForm } from '@/inters/upstream'

import { validate, VERIFY_MSG, type ValidRule } from '@/utils'
import { UPSTREAM_STORE } from '../utils'
import { syncUpstream } from '@/api/upstream'
import { toast } from 'vue-sonner'

interface UpstreamActionProps {
  row: Upstream
  index: number
}

const props = defineProps<UpstreamActionProps>()
const store = inject(UPSTREAM_STORE)!

function openUpdate() {
  store.formBase = zUpstreamForm.parse(props.row)
  const idx = store.upstreams
    .findIndex(u => u.apiId === props.row.apiId)
  store.index = idx
  store.visibleBase = true
}

function getRules(form: UpstreamCreateParams) {
  const { apiKey, serverUrl, accountId } = form
  return [
    { rule: !!apiKey, message: VERIFY_MSG.REQ_API_KEY },
    { rule: !!serverUrl, message: VERIFY_MSG.REQ_SERVER_URL },
    { rule: !!accountId, message: VERIFY_MSG.REQ_ACCOUNT_ID },
  ] as ValidRule[]
}

function handleSync() {
  const rules = getRules(store.formBase)
  if (!validate(rules)) return

  const response = syncUpstream({
    id: props.row.apiId,
    accountId: store.formBase.accountId!,
    apiKey: store.formBase.apiKey!,
    serverUrl: store.formBase.serverUrl,
    apiType: store.formBase.apiType,
  })

  response.then(() => {
    toast.success('同步成功')
  })
}
</script>

<template>
  <XButton
    icon="lucide:edit"
    label="编辑" size="sm"
    color="primary"
    @click="openUpdate"
  />
  <XButton
    v-if="row.apiType === API_TYPE.DHRU"
    icon="lucide:refresh-cw" 
    label="同步" size="sm"
    color="success"
    @click="handleSync"
  />
</template>
