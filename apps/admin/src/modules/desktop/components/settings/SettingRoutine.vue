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
  copyright: settings.beian,
  company: settings.company,
})

function handleSubmit() {
  loading.value = true

  const response = Promise.all([
    updateSetting([
      { name: 'title', content: form.title },
      { name: 'phone', content: form.phone },
      { name: 'email', content: form.email },
      { name: 'copyright', content: form.copyright },
      { name: 'company', content: form.company },
    ]),
    updateConfig([
      { key: 'url', value: form.url },
      { key: 'name', value: form.title },
    ]),
  ])

  response.then(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 divide-y px-3 overflow-y-auto">
      <FormField label="网站地址" desc="网站地址">
        <XInput v-model="form.url" placeholder="https://www.example.com" />
      </FormField>
      <FormField label="标题" desc="标题">
        <XInput v-model="form.title" placeholder="标题" />
      </FormField>
      <FormField label="联系电话" desc="联系电话">
        <XInput v-model="form.phone" placeholder="联系电话" />
      </FormField>
      <FormField label="邮箱" desc="邮箱">
        <XInput v-model="form.email" placeholder="邮箱" />
      </FormField>
      <FormField label="备案号" desc="备案号">
        <XInput v-model="form.copyright" placeholder="备案号" />
      </FormField>
      <FormField label="公司名称" desc="公司名称">
        <XInput v-model="form.company" placeholder="公司名称" />
      </FormField>
    </div>
    <div class="p-3 flex justify-end">
      <XButton label="应用修改" :loading="loading" @click="handleSubmit" />
    </div>
  </div>
</template>
