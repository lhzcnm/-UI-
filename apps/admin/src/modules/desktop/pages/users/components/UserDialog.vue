<script setup lang="ts">
import UserForm from './UserForm.vue'

import type { FormMode } from '@3un/shared'
import { EMAIL_REG, IP_REG, PASSWORD_REG, PHONE_REG, USERNAME_REG } from '@3un/utils'

import { createUser, updateUser, updateUserApiKey, updateUserBulkApiKey } from '@/api/users'
import { validate, VERIFY_MSG, type ValidRule } from '@/utils'
import { USER_STORE } from '../utils'

const options = {
  create: {
    title: '新增',
    submitText: '新增',
  },
  update: {
    title: '编辑',
    submitText: '保存',
  },
}

const store = inject(USER_STORE)!

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const loading = ref(false)

function getRules() {
  const {
    userName, userPassword, nickName,
    phone, userEmail, weiXinOpenid,
    ip, ips
  } = store.formBase

  const rules: ValidRule[] = [
    { rule: !!userName, message: VERIFY_MSG.REQ_USER_NAME },
    { rule: USERNAME_REG.test(userName), message: VERIFY_MSG.FMT_USERNAME },

    { rule: !!nickName, message: VERIFY_MSG.REQ_NICKNAME },

    { rule: !!userPassword, message: VERIFY_MSG.REQ_PASSWORD },
    { rule: PASSWORD_REG.test(userPassword), message: VERIFY_MSG.FMT_PASSWORD },
  ]

  if (weiXinOpenid) {
    rules.push({
      rule: weiXinOpenid.length === 28,
      message: VERIFY_MSG.WEIXIN_OPENID,
    })
  }

  if (phone) {
    rules.push({
      rule: PHONE_REG.test(phone),
      message: VERIFY_MSG.FMT_PHONE,
    })
  }

  if (userEmail) {
    rules.push({
      rule: EMAIL_REG.test(userEmail),
      message: VERIFY_MSG.FMT_EMAIL,
    })
  }

  if (ip) {
    rules.push({
      rule: validIp(ip),
      message: VERIFY_MSG.FMT_LOGIN_IP,
    })
  }

  if (ips) {
    rules.push({
      rule: validIp(ips),
      message: VERIFY_MSG.FMT_API_IP,
    })
  }

  return rules
}

function validIp(ip: string) {
  const ipList = ip.trim()
    .split('\n')
    .filter(Boolean)

  return ipList.every((ip) => IP_REG.test(ip))
}

function formatIp(ip: string | null) {
  if (!ip) return ''
  return ip.trim()
    .split('\n')
    .filter(Boolean)
    .join(',')
}

function handleSubmit() {
  const rules = getRules()
  if (!validate(rules)) return

  loading.value = true
  store.formBase.ip = formatIp(store.formBase.ip)
  store.formBase.ips = formatIp(store.formBase.ips)

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createUser(store.formBase)
  response.then(() => {
    store.refresh = !store.refresh
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const user = store.users.list[store.index!]
  const body = { ...store.formBase, userId: user.userId }
  const response = updateUser(body)

  response.then(() => {
    store.refresh = !store.refresh
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleApiKey() {
  const user = store.users.list[store.index!]
  const response = updateUserApiKey(user.userId)

  response.then((data) => {
    store.formBase.apiKey = data
    user.apiKey = data
  })
}

function handleBulkApiKey() {
  const user = store.users.list[store.index!]
  const response = updateUserBulkApiKey(user.userId)

  response.then((data) => {
    store.formBase.bulkCheckApi = data
    user.bulkCheckApi = data
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="options[mode].title"
    :mask-closable="false"
    draggable
    ui-root="sm:max-w-lg sm:p-0"
    ui-header="p-4 mb-0 border-b"
  >
    <UserForm
      v-model="store.formBase"
      class="max-h-[75vh] p-4 overflow-y-auto"
      @update:bulk-api-key="handleBulkApiKey"
      @update:api-key="handleApiKey"
    />
    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>
