<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting, updateConfig } from '@/api/settings'

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const { settings, configs } =
  defineProps<SettingPlaneProps>()

const loading = ref(false)
const form = reactive({
  url: configs.url,
  title: settings.title,
  phone: settings.phone,
  email: settings.email,
  beian: settings.beian,
  company: settings.company,
})

const iStore = useSystemStore()

function handleSubmit() {
  loading.value = true

  const response = Promise.all([
    updateSetting([
      { name: 'title', content: form.title },
      { name: 'phone', content: form.phone },
      { name: 'email', content: form.email },
      { name: 'beian', content: form.beian },
      { name: 'company', content: form.company },
    ]),
    updateConfig([
      { key: 'url', value: form.url },
      { key: 'name', value: form.title },
    ]),
  ])

  response.then(() => {
    iStore.showSetting = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 divide-y pb-4 overflow-y-auto">
      <FormField
        label="网站地址"
        desc="请填写完整的网站地址"
        variant="vertical"
      >
        <XInput v-model="form.url" placeholder="https://www.example.com" />
      </FormField>

      <FormField
        label="标题"
        desc="显示在浏览器标题栏的网站名称"
        variant="vertical"
      >
        <XInput v-model="form.title" placeholder="标题" />
      </FormField>

      <FormField
        label="联系电话"
        desc="对外公布的客服或商务联系电话"
        variant="vertical"
      >
        <XInput v-model="form.phone" placeholder="联系电话" />
      </FormField>

      <FormField
        label="邮箱"
        desc="用于接收系统通知的联系邮箱"
        variant="vertical"
      >
        <XInput v-model="form.email" placeholder="邮箱" />
      </FormField>

      <FormField
        label="备案号"
        desc="工信部ICP备案号"
        variant="vertical"
      >
        <XInput v-model="form.beian" placeholder="备案号" />
      </FormField>

      <FormField
        label="公司名称"
        desc="网站所属公司的全称"
        variant="vertical"
      >
        <XInput v-model="form.company" placeholder="公司名称" />
      </FormField>
    </div>
    <div class="pt-3 flex justify-end border-t">
      <XButton label="应用修改" :loading="loading" @click="handleSubmit" />
    </div>
  </div>
</template>
