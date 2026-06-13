<script setup lang="ts">
import { LOCAL_MODULE_ENUM } from '../utils/enum';
import { useLocalStore } from '../utils/store';

const store = useLocalStore()

interface formProps {
  module?: number;
  ch: string;
  en: string;
  fullKey: string;
}

const form = ref<formProps>({
  module: -1,
  ch: '',
  en: '',
  fullKey: '',
})

function searchBtn() {
  const { module, ch, en, fullKey } = form.value;
  
  Object.assign(store.searchForm, {
    ch,
    en,
    fullKey,
    ...(module !== -1 && { module })
  });
  
  store.getData();
  
  store.searchForm.page = 1;
  store.localDialog.searchDialog = false;
  
  resetForm();
}

function resetForm() {
  form.value = {
    module: -1,
    ch: '',
    en: '',
    fullKey: '',
  };
}

</script>

<template>
  <TheModal v-model="store.localDialog.searchDialog" title="搜索前台中英文">
    <div
      class="space-y-4 flex flex-col justify-between p-4 border-t select-none max-h-[600px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @submit.prevent">
      <div v-if="store.query == '-1'" class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          模块 :
        </label>

        <div class="w-2/3">
          <XSelect v-model="form.module">
            <XSelectItem :value="-1" label="全部" />
            <XSelectItem v-for="item in LOCAL_MODULE_ENUM" :value="item.value" :label="item.label" />
          </XSelect>
        </div>
      </div>

      <div class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">

          中文名 :
        </label>
        <XInput v-model="form.ch" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入中文名" />
      </div>

      <div class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <!-- <span class="text-red-500 mr-1">*</span> -->
          英文名 :
        </label>
        <XInput v-model="form.en" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入英文名" />
      </div>

      <div class="flex justify-between flex-1">
        <label for="userName" class="text-sm font-medium text-gray-700 flex items-center dark:text-gray-400">
          <!-- <span class="text-red-500 mr-1">*</span> -->
          唯一KEY :
        </label>
        <XInput v-model="form.fullKey" ui-root="w-2/3 dark:text-gray-400" placeholder="请输入唯一KEY" />
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-auto border-t px-4 select-none">
      <div class="py-4 ml-auto space-x-2">
        <XButton variant="soft" @click="store.localDialog.searchDialog = false">取消</XButton>
        <XButton @click="searchBtn">搜索</XButton>
      </div>
    </div>
  </TheModal>
</template>