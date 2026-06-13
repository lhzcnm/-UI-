<script setup lang="ts">
import type { postLocalParams } from '@/types/local'
import { useLocalStore } from '../utils/store';
import { LOCAL_MODULE_ENUM } from '../utils/enum';
const store = useLocalStore()

interface Form extends postLocalParams {
  ids?: number[]
}

const form = defineModel<Form>({required: true})


</script>

<template>
  <form
      class="space-y-4 flex flex-col justify-between p-4 border-t select-none max-h-[600px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @submit.prevent>
      <div v-if="store.query == '-1' && store.isShow" class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <span class="text-red-500 mr-1">*</span>
          模块 :
        </label>

        <div class="w-2/3">
          <XSelect v-model="form.module">
            <XSelectItem v-for="item in LOCAL_MODULE_ENUM" :value="item.value" :label="item.label" />
          </XSelect>
        </div>
      </div>

      <div class="flex justify-between flex-1" v-if="store.localDialog.createDialog">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <span class="text-red-500 mr-1">*</span>
          唯一KEY :
        </label>
        <XInput v-model="form.messageKey" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入唯一key" />
      </div>

      <div class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <span class="text-red-500 mr-1">*</span>
          中文名 :
        </label>
        <XInput v-model="form.ch" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入中文名" />
      </div>

      <div class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <span class="text-red-500 mr-1">*</span>
          英文名 :
        </label>
        <XInput v-model="form.en" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入英文名" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <!-- <span class="text-red-500 mr-1">*</span> -->
          描述 :
        </label>

        <XTextarea rows="3" v-model="form.remark" class="w-full dark:text-gray-400" placeholder="请输入备注" />
      </div>
    </form>
</template>