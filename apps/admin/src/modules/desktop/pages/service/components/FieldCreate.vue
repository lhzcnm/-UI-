<script setup lang="ts">
import { toast } from 'vue-sonner'

import { zServiceFieldForm, type ServiceFieldCreateParams, type ServiceFieldForm } from '@/inters/services'
import { FIELD_STORE } from '../utils'
import { createServiceField } from '@/api/services'

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
    toast.success("新增成功")
    store.visibleCreate = false
  } finally {}
}
</script>

<template>
  <XDialog
    v-model="store.visibleCreate"
    title="新增服务字段"
    draggable
    ui-root="sm:p-0 sm:max-w-md sm:max-h-[80vh]"
    ui-header="p-4 border-b"
  >
    <template #default>
      <div class="px-4 pb-4 flex flex-col gap-2 border-b">
        <div class="text-center text-xs text-muted-foreground">保存时自动过滤信息不全数据</div>
        <div class="flex items-center gap-4">
          <SelectService v-model="serviceId" />
          <XButton label="新增字段" @click.stop="handleAddField" />
        </div>

        <div class="flex flex-col gap-2">
          <FieldBatchForm
            v-for="(_, index) in createFields"
            :key="generateUniqueId()"
            v-model="createFields[index]"
            @delete="handleDelete(index)"
          />
          <!-- <div class="border p-2 rounded-md" v-for="(item, index) in createFields" :key="generateUniqueId()">
            <FormField label="字段名称" desc="字段中文名">
              <XInput v-model="item.name" placeholder="字段名称" />
            </FormField>

            <FormField label="字段名称EN" desc="字段英文名">
              <XInput v-model="item.nameEn" placeholder="字段名称EN" />
            </FormField>

            <FormField label="字段宽度" desc="字段在前台的默认宽度">
              <XInputNumber v-model="item.width" :step="10" placeholder="字段宽度" />
            </FormField>

            <FormField label="排序" desc="字段返回顺序">
              <XInputNumber v-model="item.sortNum" :step="1" placeholder="排序" />
            </FormField>

            <FormField label="是否显示" desc="是否显示字段">
              <XSwitch v-model="item.status" :active-value="1" :inactive-value="0" />
            </FormField>

            <div class="flex justify-end">
              <XButton variant="ghost" label="删除" color="danger" @click="handleDelete(index)" />
            </div>
          </div> -->
        </div>
      </div>
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton label="取消" variant="soft" @click="store.visibleCreate = false" />
        <XButton label="保存" @click="handleSave" />
      </div>
    </template>
  </XDialog>
</template>
