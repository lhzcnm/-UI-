<script setup lang="ts">
import { zServiceFieldForm, type ServiceFieldCreateParams, type ServiceFieldForm } from '@/inters/services';
import { FIELD_STORE } from '../utils'
import { toast } from 'vue-sonner';
import { createServiceField } from '@/api/services';

const store = inject(FIELD_STORE)!

const createFields = ref<ServiceFieldForm[]>([])
const serviceId = ref<number>(0)

watch(
  () => store.visibleCreate,
  (val) => {
    if (val) {
      createFields.value.length = 0
      if (store.serviceId) {
        serviceId.value = store.serviceId
      }
    }
  }
)

function handleAddField() {
  if (!serviceId.value) return toast.warning('请选择服务后重试')
  createFields.value.push(zServiceFieldForm.parse({}))
}

function generateUniqueId() {
  return Date.now() + Math.random()
}

function handleDelete(index: number) {
  createFields.value.splice(index, 1)
}

function processData(data: ServiceFieldForm[]) {
  // console.log(data)
  return data
    .filter((field) => !!field.name && !!field.nameEn && field.sortNum >= 0 && field.width > 0)
    .map((field) => ({ ...field, serviceId: serviceId.value }))
}

async function handleSave() {
  const body: ServiceFieldCreateParams = {
    items: processData(createFields.value)
  }

  try {
    await createServiceField(body)
    
    store.refresh = !store.refresh
    store.visibleCreate = false
  } finally {}
}
</script>

<template>
  <TheModal
    v-model="store.visibleCreate"
    title="新增服务字段"
    class="flex flex-col"
    header-class="border-b"
  >
    <template #default>
      <div class="p-4 h-full flex flex-col gap-2 border-b overflow-y-auto">
        <div class="text-center text-xs text-muted-foreground">保存时自动过滤信息不全数据</div>
        <div class="pb-2 flex items-center space-x-4 border-b">
          <SelectService v-model="serviceId" />
          <XButton label="新增字段" @click.stop="handleAddField" />
        </div>

        <div class="flex-1 pb-2 border-b flex flex-col space-y-2 overflow-y-auto">
          <FieldBatchForm
            v-for="(_, index) in createFields"
            :key="generateUniqueId()"
            v-model="createFields[index]"
            @delete="handleDelete(index)"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <XButton label="取消" variant="soft" @click="store.visibleCreate = false" />
          <XButton label="保存" @click="handleSave" />
        </div>
      </div>
    </template>
  </TheModal>
</template>
