<script setup lang="ts">
import { API_TYPE, API_TYPE_MAP, xconfirm } from '@3un/utils'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'

import type { Upstream, UpstreamCreateParams } from '@/inters/upstream'
import { deleteUpstreams, syncUpstream } from '@/api/upstream'
import { zUpstreamForm } from '@/inters/upstream'

import { validate, VERIFY_MSG, type ValidRule } from '@/utils'
import { UPSTREAM_STORE } from '../utils'

interface UpstreamCardProps {
  item: Upstream
  index: number
}

const props = defineProps<UpstreamCardProps>()
  const store = inject(UPSTREAM_STORE)!

function openUpdate() {
  store.formBase = zUpstreamForm.parse(props.item)
  const idx = store.upstreams
    .findIndex(u => u.apiId === props.item.apiId)

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
  const form = zUpstreamForm.parse(props.item)
  const rules = getRules(form)
  if (!validate(rules)) return

  const response = syncUpstream({
    id: props.item.apiId,
    accountId: form.accountId!,
    apiKey: form.apiKey!,
    serverUrl: form.serverUrl,
    apiType: form.apiType,
  })

  response.then(() => {
    toast.success('同步成功')
  })
}

async function handleDelete() {
  if (!await xconfirm('确定删除该记录吗？')) return

  deleteUpstreams([props.item.apiId]).then(() => {
    store.upstreams.splice(props.index, 1)
  })
}
</script>

<template>
  <div class="bg-card border space-y-3 rounded-lg">
    <div class="flex items-center justify-between px-3 pt-3">
      <h3>{{ item.apiTitle }}</h3>
      <XTag size="sm" v-bind="API_TYPE_MAP[item.apiType]" />
    </div>

    <div class="px-3 empty:hidden text-sm">
      <div v-if="item.accountId" class="flex items-start">
        <span class="text-muted-foreground shrink-0">用户名：</span>
        <span class="font-medium break-all">{{ item.accountId }}</span>
      </div>
      <div v-if="item.apiKey" class="flex items-center">
        <span class="text-muted-foreground shrink-0">密钥：</span>
        <span class="font-medium break-all">{{ item.apiKey }}</span>
      </div>
    </div>

    <div v-if="item.serverUrl" class="px-3 text-sm">
      <div class="text-muted-foreground mb-1">上游地址</div>
      <div
        class="bg-muted rounded p-3 break-all"
        v-text="item.serverUrl"
      />
    </div>

    <div
      :class="twJoin(
        'flex items-center justify-between',
        'px-3 py-2 border-t border-dashed',
      )"
    >
      <XButton
        v-if="item.apiType === API_TYPE.DHRU"
        icon="lucide:refresh-cw" 
        label="同步" size="sm"
        color="success"
        @click="handleSync"
      />

      <div class="ml-auto space-x-2">
        <XButton
          icon="lucide:trash-2"
          label="删除" size="sm"
          color="danger"
          @click="handleDelete"
        />
        <XButton
          icon="lucide:edit"
          label="编辑" size="sm"
          color="primary"
          @click="openUpdate"
        />
      </div>
    </div>
  </div>
</template>
