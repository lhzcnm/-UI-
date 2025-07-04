<script setup lang="ts">
import ItemUpstreamForm from './ItemUpstreamForm.vue'

import { toast } from 'vue-sonner'

import type { UpstreamService } from '@/inters/upstream'
import { getUpstreamServices } from '@/api/upstream'
import { updateUpstreamService } from '@/api/services'

import { SERVICE_STORE } from '../utils'

const store = inject(SERVICE_STORE)!

const serviceStore = useServiceStore()
const serviceList = shallowRef<UpstreamService[]>([])
const loading = ref(false)

watch(
  () => store.visibleUpstream,
  async (value) => {
    if (!value) return

    const apiId = store.formUpstream.apiId
    if (!apiId) return

    const data = await getUpstreamServices(apiId)
    serviceList.value = data || []
  }
)

function handleSubmit() {
  const { serviceId, externalNetworkId, apiId } = store.formUpstream
  // if (isNullish(apiId)) return toast.error('请选择上游接口')

  const service = serviceList.value
    .find(item => item.serviceId === externalNetworkId)

  const response = updateUpstreamService({
    apiId: apiId || -1, // 上游接口
    serviceId, // 上游服务ID
    externalNetworkId, // 外部网络ID
    serviceName: service?.serviceName, // 上游服务名称
    serviceTime: service?.serviceTime, // 上游服务时间
  })

  response.then(() => {
    serviceStore.getItems(true)
    toast.success('设置上游服务成功')
    store.visibleUpstream = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <TheModal
    v-model="store.visibleUpstream"
    title="选择上游服务"
  >
    <ItemUpstreamForm
      v-model="store.formUpstream"
      v-model:service-list="serviceList"
      :upstreams="store.upstreams"
      class="px-4"
    />

    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="store.visibleUpstream = false">取消</XButton>
      <XButton :loading="loading" @click="handleSubmit">确定</XButton>
    </div>
  </TheModal>
</template>
