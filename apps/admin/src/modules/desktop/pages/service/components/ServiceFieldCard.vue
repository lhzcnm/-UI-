<script setup lang="ts">
import { type ServiceFieldSyncItem } from '@/inters/services'
import { handleInputNumberChange } from '@/utils';

const field = defineModel<ServiceFieldSyncItem>({ required: true })
</script>

<template>
  <div class="bg-card  gap-y-2 flex flex-col">
    <div class="px-4 py-2 flex flex-col gap-2 relative border rounded">
      <div class="flex-1 flex gap-2">
        <XFormField ui-root="flex-1 last:p-0 first:p-0 p-0" variant="vertical" label="字段名(中文)">
          <XInput
            v-model="field.name"
            placeholder="字段名(中文)"
          />
        </XFormField>
        <XFormField ui-root="flex-1 last:p-0 first:p-0 p-0" variant="vertical" label="字段名(英文)">
          <XInput
            v-model="field.nameEn"
            placeholder="字段名(中文)"
          />
        </XFormField>
      </div>
  
      <div class="flex-1 flex gap-2">
        <XFormField ui-root="flex-1 last:p-0 first:p-0 p-0" variant="vertical" label="字段宽度">
          <XInput
            v-model="field.width"
            placeholder="字段宽度"
            @input="(e: Event) => field.width = handleInputNumberChange(e, 0)!"
            @change="(e: Event) => field.width = handleInputNumberChange(e, 0)!"
          />
        </XFormField>
        <XFormField ui-root="flex-1 last:p-0 first:p-0 p-0" variant="vertical" label="字段排序(越大越前)">
          <XInputNumber
            v-model="field.sortNum"
            placeholder="字段排序"
            :step="1"
            :precision="0"
          />
        </XFormField>
        <XFormField ui-root="flex-1 last:p-0 first:p-0 p-0" variant="vertical" label="启用状态">
          <!-- <XInputNumber
            v-model="field.sortNum"
            placeholder="字段排序"
            :step="1"
            :precision="0"
          /> -->
          <XSwitch
            v-model="field.status"
            :active-value="1"
            :inactive-value="0"
          />
        </XFormField>
      </div>

      <div
        v-if="field.isDelete"
        class="absolute inset-0 bg-black/20 z-10"
      ></div>
      <div
        v-if="field.isDelete"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          class="text-4xl font-bold text-danger/80 rotate-[-20deg] select-none"
        >
          已被删除
        </span>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <XButton v-show="!field.isDelete" label="删除字段" color="danger" size="sm" @click="field.isDelete = true" />
      <XButton v-show="field.isDelete" label="取消删除字段" color="warning" size="sm" @click="field.isDelete = false" />
    </div>

    <hr class="w-full h-px border-border">
  </div>
</template>
