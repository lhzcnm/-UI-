<script setup lang="ts">
import ServiceFieldCard from './ServiceFieldCard.vue'

import { type ServiceFieldSyncItem, zServiceFieldSyncItem } from '@/inters/services'
import { SERVICE_STORE } from '../utils'
import { getServcieFieldNotPage, saveServiceFields } from '@/api/services'
import { toast } from 'vue-sonner'

const serviceStore = useServiceStore()

const store = inject(SERVICE_STORE)!

const fields = ref<ServiceFieldSyncItem[]>([])
const loading = ref<boolean>(false)

watch(
  () => store.visibleField,
  async () => {
    fields.value = []
    await getFields()
  }
)

const service = computed(() => {
  if (store.selectId === undefined) {
    return null
  }

  return serviceStore.itemMap.get(store.selectId)
})

async function getFields() {
  if (service.value == null) {
    return
  }

  const id = service.value.packageId

  const serviceFields = await getServcieFieldNotPage(id)

  fields.value = serviceFields.map(x => ({
    serviceId: x.serviceId,
    name: x.name,
    nameEn: x.nameEn,
    width: x.width,
    sortNum: x.sortNum,
    status: x.status,
    id: x.id,
    isDelete: false,
  }))
}

function handleCreate() {
  const field = zServiceFieldSyncItem.parse({})
  fields.value.unshift(field)
}

async function handleConfirm() {
  if (service.value == null) return

  const submitedFields = fields.value.filter(x => !x.isDelete)

  const invalid = submitedFields.some(
    x => !x.name?.trim() || !x.nameEn?.trim()
  )

  if (invalid) {
    toast.warning('字段名(中文)和字段名(英文)不能为空')
    return
  }

  const items: ServiceFieldSyncItem[] = submitedFields.map(x => ({ ...x, serviceId: service.value!.packageId }))

  try {
    loading.value = true
    await saveServiceFields({ items: items, serviceId: service.value.packageId })
    toast.success('保存成功')
    store.visibleField = false
  } catch {} finally {
    loading.value = false
  }
}

function getUniqueKey() {
  return new Date().toString()
}
</script>

<template>
  <TheModal
    v-model="store.visibleField"
    title="服务字段"
    header-class="border-b"
    class="flex flex-col"
  >
    <div class="mt-2 px-4 pb-2 flex flex-col gap-y-2 overflow-y-auto">
      <div class="flex justify-between items-center font-semibold text-xl">
        <span>{{ service ? service.packageTitle : '服务不存在' }}</span>
        <XButton label="新增字段" @click="handleCreate" />
      </div>

      <section class="flex-1 flex flex-col gap-y-2 overflow-y-auto">
        <ServiceFieldCard
          v-for="(_, index) in fields" :key="getUniqueKey()"
          v-model="fields[index]"
        />
      </section>

      <div class="flex justify-end space-x-2">
        <XButton label="取消" variant="soft" @click="store.visibleField = false" />
        <XButton label="保存" @click="handleConfirm" />
      </div>
    </div>
  </TheModal>
</template>
