<script setup lang="ts">
// import { execFile } from 'child_process';
import Action from './components/Action.vue'
import CreateDialog from './components/CreateDialog.vue'
import SearchDialog from './components/SearchDialog.vue'
import UpdateDialog from './components/UpdateDialog.vue'

import { createLocalForm, useLocalStore } from './utils/store.ts'

const store = useLocalStore()

watch(
  () => [store.searchForm.page, store.searchForm.pageSize],
  ([page, pageSize], [oldPage, oldPageSize]) => {
    if (page !== oldPage) {
      store.getData()
    }
    if (pageSize !== oldPageSize) {
      store.searchForm.page = 1
      store.getData()
    }

  }, { deep: true })

function clearForm() {
  store.searchForm = {
    ...store.searchForm,
    ch: '',
    en: '',
    fullKey: '',
    module: Number(store.query) == -1 ? undefined : Number(store.query)
  }
  store.getData()
}

const route = useRoute()

watch(() => route.query.q, (q) => {
  store.query = q ? String(route.query.q) : '-1'
  const queryModule = Number(store.query)

  store.searchForm.module = queryModule === -1 ? undefined : queryModule
  store.createForm.module = queryModule
  store.updateForm.module = queryModule
  clearForm()
  store.getData()
}, { immediate: true })


watch(() => store.localDialog.createDialog, () => {
  if (!store.localDialog.createDialog) {
    clearCreateForm()
  }
})

function clearCreateForm() {
  if (store.query == '-1') {
    store.createForm = { ...createLocalForm }
  } else {
    store.createForm = {
      ...createLocalForm,
      module: Number(store.query)
    }
  }
}

onMounted(() => {
  store.isShow = import.meta.env.VITE_APP_LOCAL == 'true'
})
</script>

<template>
  <div>
    <section class="w-full flex justify-between p-2 border-b ">
      <div class="space-x-2 flex items-center">
        <XButton size="sm" @click="store.localDialog.searchDialog = true" label="筛选" variant="outline" />
        <XButton size="sm" @click="clearForm" label="刷新" color="warning" variant="outline" />
        <XButton size="sm" v-if="store.isShow" @click="store.localDialog.createDialog = true" label="新增" color="success"
          variant="outline" />
      </div>


      <XSimplePagination v-model="store.searchForm.page" :limit="store.searchForm.pageSize" :total="store.total" />
    </section>

    <section class="flex-1 overflow-y-auto">
      <ul class="space-y-3 p-2">
        <li v-for="item in store.localList" :key="item.id">
          <div class="rounded-lg border border-border bg-card hover:shadow-md transition-shadow duration-200">
            <div class="border-b border-border bg-muted/30 px-4 py-2 rounded-t-lg">
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-sky-500">Key : {{ item.messageKey || '-' }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {{ item.moduleName || '未分类' }}
                </span>
              </div>
            </div>

            <div class="px-4 py-3 space-y-2">
              <div class="flex items-baseline text-sm">
                <div class="w-24 flex-shrink-0 text-muted-foreground">中文名称：</div>
                <div class="flex-1 font-medium">{{ item.ch || '-' }}</div>
              </div>

              <div class="flex items-baseline text-sm">
                <div class="w-24 flex-shrink-0 text-muted-foreground">英文名称：</div>
                <div class="flex-1">{{ item.en || '-' }}</div>
              </div>

              <div class="flex items-baseline text-sm">
                <div class="w-24 flex-shrink-0 text-muted-foreground">备注: </div>
                <div class="flex-1">{{ item.remark || '-' }}</div>
              </div>
            </div>

            <Action :row="item"/>
          </div>
        </li>
      </ul>
    </section>
  </div>

  <SearchDialog />
  <CreateDialog />
  <UpdateDialog />
</template>