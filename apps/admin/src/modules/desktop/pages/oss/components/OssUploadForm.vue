<script setup lang="ts">
import { type OssUpload } from '@/inters/oss'
import { OSS_UPLOAD_TYPE_LIST } from '@/utils/enum'

const form = defineModel<OssUpload>({ required: true })
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField
      label="更新 oss id"
      desc="需要更新的oss id"
      :content-flex="true"
    >
      <XSelect
        v-model="form.ossId">
        <XSelectItem
          v-for="ossItem in OSS_UPLOAD_TYPE_LIST"
          :key="ossItem.value"
          :value="ossItem.value"
          :label="ossItem.label"
        />
      </XSelect>
    </FormField>

    <FormField label="oss 文件名" desc="需要更改的文件名" variant="vertical">
      <XInput placeholder="请输入文件名" v-model="form.fileName" />
    </FormField>

    <FormField label="oss 链接" desc="需要更改的oss链接" variant="vertical">
      <XInput placeholder="请输入文件名" v-model="form.url" />
    </FormField>
  </form>
</template>
