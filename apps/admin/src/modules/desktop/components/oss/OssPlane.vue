<script setup lang="ts">
import { toast } from 'vue-sonner'

import { getMonitorServers } from '@/api/monitor'
import { updateServerOss } from '@/api/oss'
import type { MonitorServer } from '@/inters/monitor/server'
import { zOssUpload, type OssUpdateParams } from '@/inters/oss'
import { OSS_UPLOAD_TYPE_LIST } from '@/utils/enum'

interface OptionItem {
  value: number,
  label: string,
}

const iStore = useSystemStore()

const serverOptions = ref<OptionItem[]>([])
const form = ref<OssUpdateParams>({
  serviceId: 0,
  tblOss: zOssUpload.parse({}),
})

watch(
  () => iStore.showOss,
  async (val) => {
    // console.log(val)
    if (val) {
      await getServers()
      form.value = {
        serviceId: 0,
        tblOss: zOssUpload.parse({}),
      }
    }
  }
)

async function getServers() {
  const data = await getMonitorServers({ page: 1, pageSize: 1000, })
  processServerData(data.list)
}

function processServerData(data: MonitorServer[]) {
  const res: OptionItem[] = []

  for (let server of data) {
    res.push({
      value: server.serverId,
      label: server.serverName,
    })
  }

  serverOptions.value = res
}

async function handleConfirm() {
  try {
    await updateServerOss(form.value)
    toast.success('更新成功')
    // iStore.showOss = false

    form.value = {
      serviceId: 0,
      tblOss: zOssUpload.parse({}),
    }
  } catch {}
}

await getServers()
</script>

<template>
  <XDialog
    v-model="iStore.showOss"
    draggable
    title="桌面端程序更新"
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 border-b"
  >
    <template #default>
      <form class="divide-y p-4" @submit.prevent>
        <FormField label="上传服务器" desc="需要上传的服务器">
          <XSelect
            v-model="form.serviceId"
          >
            <XSelectItem
              v-for="option in serverOptions" :key="option.value"
              :label="option.label" :value="option.value"
            />
          </XSelect>
        </FormField>

        <FormField
          label="更新 oss id"
          desc="需要更新的oss id"
          :content-flex="true"
        >
          <XSelect
            v-model="form.tblOss.ossId">
            <XSelectItem
              v-for="ossItem in OSS_UPLOAD_TYPE_LIST"
              :key="ossItem.value"
              :value="ossItem.value"
              :label="ossItem.label"
            />
          </XSelect>
        </FormField>

        <FormField label="oss 文件名" desc="需要更改的文件名" variant="vertical">
          <XInput placeholder="请输入文件名" v-model="form.tblOss.fileName" />
        </FormField>

        <FormField label="oss 链接" desc="需要更改的oss链接" variant="vertical">
          <XInput placeholder="请输入文件名" v-model="form.tblOss.url" />
        </FormField>
      </form>
    </template>

    <template #footer>
      <div class="p-4 flex items-center justify-end gap-2">
        <XButton label="取消" variant="soft" @click="iStore.showOss = false" />
        <XButton label="确认" @click="handleConfirm" />
      </div>
    </template>
  </XDialog>
</template>
