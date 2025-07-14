<script setup lang="ts">
import type { UpstreamCreateParams } from '@/inters/upstream'
import { API_TYPE, API_TYPE_LIST } from '@3un/utils'

const form = defineModel<UpstreamCreateParams>({ required: true })
const isRealtime = computed(() => form.value.apiType === API_TYPE.REALTIME)

watchEffect(() => {
  const apiType = form.value.apiType
  if (apiType === API_TYPE.REALTIME) {
    form.value.accountId = null
    form.value.apiKey = null
  }
})
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">API名称</label>
        <XInput v-model="form.apiTitle" placeholder="API标题" />
      </div>
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">API类型</label>
        <XNativeSelect
          v-model="form.apiType"
          :options="API_TYPE_LIST"
          placeholder="选择API类型"
          value-key="value"
          label-key="label"
        />
      </div>
    </div>
    <div>
      <label class="block text-label text-sm mb-1">用户名/账号ID</label>
      <XInput
        v-model="form.accountId"
        :disabled="isRealtime"
        placeholder="用户名、账号ID"
      />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">API密钥</label>
      <XInput
        v-model="form.apiKey"
        :disabled="isRealtime"
        placeholder="API密钥"
      />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">API地址</label>
      <XTextarea
        v-model="form.serverUrl"
        placeholder="API地址"
        rows="4"
      />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">禁用</label>
      <XSwitch v-model="form.disableApi" placeholder="禁用" />
    </div>
  </form>
</template>
