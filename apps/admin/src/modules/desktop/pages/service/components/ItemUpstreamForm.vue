<script setup lang="ts">
import type { UpstreamServiceForm } from '@/inters/services'
import type { Upstream, UpstreamService } from '@/inters/upstream'
import { getUpstreamServices } from '@/api/upstream'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface ItemUpstreamFormProps {
  upstreams: Upstream[]
}

const props = defineProps<ItemUpstreamFormProps>()

const form = defineModel<UpstreamServiceForm>({ required: true })
const serviceList = defineModel<UpstreamService[]>('serviceList', { required: true })

const searchApiId = ref<string>('')
const searchServiceName = ref<string>('')

const _upstreams = computed(() => {
  const search = searchApiId.value.trim().toLowerCase()
  return props.upstreams.filter(item =>
    item.apiId.toString().includes(search) ||
    item.apiTitle.toLowerCase().includes(search)
  )
})

const _services = computed(() => {
  const search = searchServiceName.value.trim().toLowerCase()
  return serviceList.value.filter(item =>
    item.serviceId.toString().includes(search) ||
    item.serviceName.toLowerCase().includes(search)
  )
})

async function handleUpstreamChange(apiId: number) {
  const data = await getUpstreamServices(apiId)
  serviceList.value = data
}

function toggleSelectedService(e: MouseEvent) {
  const target = e.target as HTMLButtonElement
  const element = target.closest('[data-id]')!
  const serviceId = element.getAttribute('data-id')!

  if (form.value.externalNetworkId === serviceId) {
    form.value.externalNetworkId = '0'
  }
  else {
    form.value.externalNetworkId = serviceId
  }
}

function formatLabel(item: UpstreamService) {
  const label = item.serviceName.replace(/^#[0-9]+-/, '')
  return `${item.serviceId} - ${label}`
}
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm font-medium mb-1">上游接口名称</label>
      <XSelect
        v-model="form.apiId"
        v-model:input="searchApiId"
        placeholder="请选择上游接口"
        clearable filterable

        @selected="handleUpstreamChange"
        @clear="serviceList = []"
      >
        <XSelectItem
          v-for="item in _upstreams" :key="item.apiId"
          :value="item.apiId" :label="`${item.apiId} - ${item.apiTitle}`"
        />
      </XSelect>
    </div>

    <div>
      <label class="block text-label text-sm font-medium mb-1">上游服务</label>
      <div class="space-y-1 p-1 border rounded shadow-sm">
        <XInput v-model="searchServiceName" placeholder="搜索服务" clearable filterable />

        <div
          class="overflow-y-auto overflow-x-hidden h-72"
          @click="toggleSelectedService"
        >
          <div
            v-if="!serviceList.length"
            :class="twJoin(
              'flex items-center justify-center',
              'text-sm text-muted-foreground h-full',
            )"
          >
            暂无上游服务
          </div>

          <button
            v-for="item in _services" :key="item.id"
            :data-id="item.serviceId"
            :title="item.serviceName"
            :class="twJoin(
              'flex items-center w-full px-2 py-1.5 rounded',
              'whitespace-nowrap text-sm text-left hover:bg-accent/15',
            )"
          >
            <Icon
              v-if="form.externalNetworkId === item.serviceId"
              class="inline-block size-4 mr-2 p-0.5 bg-primary text-white rounded-full"
              icon="lucide:check"
            />
            <div class="flex-1 truncate">{{ formatLabel(item) }}</div>
            <span class="text-primary">￥{{ item.servicePrice }}</span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
