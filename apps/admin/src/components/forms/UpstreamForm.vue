<script setup lang="ts">
import type { UpstreamCreateParams } from '@/inters/upstream'
import { API_TYPE, API_TYPE_LIST } from '@3un/utils'

const form = defineModel<UpstreamCreateParams>({ required: true })
const isRealtime = computed(() => form.value.apiType === API_TYPE.REALTIME)

// watchEffect(() => {
//   const apiType = form.value.apiType
//   if (apiType === API_TYPE.REALTIME) {
//     form.value.accountId = ''
//     form.value.apiKey = ''
//   }
// })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div class="flex space-x-3">
      <div class="w-1/2">
        <label class="block text-sm mb-1">API名称</label>
        <XInput v-model="form.apiTitle" placeholder="API标题" />
      </div>
      <div class="w-1/2">
        <label class="block text-sm mb-1">API类型</label>
        <XSelect v-model="form.apiType" placeholder="选择API类型">
          <XSelectItem
            v-for="item in API_TYPE_LIST" :key="item.value"
            :value="item.value" :label="item.label"
          />
        </XSelect>
      </div>
    </div>
    <div>
      <label class="block text-sm mb-1">用户名/账号ID</label>
      <XInput
        v-model="form.accountId"
        :disabled="isRealtime"
        placeholder="用户名、账号ID"
      />
    </div>
    <div>
      <label class="block text-sm mb-1">API密钥</label>
      <XInput
        v-model="form.apiKey"
        :disabled="isRealtime"
        placeholder="API密钥"
      />
    </div>
    <div>
      <label class="block text-sm mb-1">API地址</label>
      <XTextarea
        v-model="form.serverUrl"
        placeholder="API地址"
        rows="4"
      />
    </div>
    <div>
      <label class="block text-sm mb-1">禁用</label>
      <XSwitch v-model="form.disableApi" placeholder="禁用" />
    </div>
  </form>
</template>
