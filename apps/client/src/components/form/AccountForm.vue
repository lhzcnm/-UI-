<script setup lang="ts">
import { toast } from 'vue-sonner'

import { USERNAME_REG } from '@3un/utils'
import { VERIFY_MSG, validate } from '@/utils'

const props = defineProps<{ onClose: () => void }>()
const store = useUserStore()
const account = ref('')

const { t } = useI18n()
const localStore = useLocalStore()

async function submitForm() {
  const username = account.value.trim()
  const rules = [
    { rule: !!username, message: localStore.localData[VERIFY_MSG.USERNAME] },
    { rule: username.length >= 6 && username.length <= 16, message: localStore.localData[VERIFY_MSG.USERNAME_LENGTH] },
    { rule: USERNAME_REG.test(username), message: localStore.localData[VERIFY_MSG.USERNAME_FORMAT] },
  ]

  if (!validate(rules)) return
  store.updateName(username)

  toast.success(t('submit.success', { action: t('action.modify') }))
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <div>
      <p class="mb-3">{{ localStore.localData['top_Current'] }}: <b>{{ store.info.username }}</b></p>
      <XInput v-model="account" name="username" :placeholder="localStore.localData['login_Account']" />
    </div>
    <XButton type="submit" class="w-full">{{ localStore.localData['top_Confirm'] }}</XButton>
  </form>
</template>
