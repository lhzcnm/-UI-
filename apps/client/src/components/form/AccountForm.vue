<script setup lang="ts">
import { toast } from 'vue-sonner'

import { USERNAME_REG } from '@3un/utils'
import { VERIFY_MSG, validate } from '@/utils'

const props = defineProps<{ onClose: () => void }>()
const store = useUserStore()
const account = ref('')

async function submitForm() {
  const rules = [
    { rule: !!account.value.trim(), message: VERIFY_MSG.USERNAME },
    { rule: account.value.length < 6, message: '账号长度不得低于6位' },
    { rule: USERNAME_REG.test(account.value), message: VERIFY_MSG.USERNAME_FORMAT },
  ]

  if (!validate(rules)) return
  store.updateName(account.value)

  toast.success('修改成功')
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <div>
      <p class="mb-3">当前账号：<b>{{ store.info.username }}</b></p>
      <XInput v-model="account" placeholder="请输入登录的账号" />
    </div>
    <XButton type="submit" class="w-full">确定</XButton>
  </form>
</template>
