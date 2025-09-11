<script setup lang="ts">
import { Icon } from '@iconify/vue'

import FormField from './FormField.vue'
import UserCard from './UserCard.vue'

import type { Action } from '../types'
import { twJoin } from 'tailwind-merge'

const store = useUserStore()
const { t } = useI18n()

const activeForm = ref<Action | null>(null)
const activeTitle = computed(() => {
  const options = {
    account: t('profile.form.title.account'),
    password: t('profile.form.title.pwd'),
    phone: t('profile.form.title.phone'),
    email: t('profile.form.title.email'),
    wechat: t('profile.form.title.wechat'),
  }

  return options[activeForm.value as Action]
})

function showForm(type: Action) {
  activeForm.value = type
}

function closeForm() {
  activeForm.value = null
}
</script>

<template>
  <section class="w-[24rem] shrink-0 p-4">
    <UserCard />

    <div class="relative mt-4">
      <FormField
        :label="t('profile.form.label.account')" class="mb-4"
        :action-text="t('profile.edit')"
        :value="store.info.username"
        @action="showForm('account')"
      />

      <FormField
        :label="t('profile.form.label.wechat')" class="mb-4"
        :value="store.info.openId ? t('profile.params.bind.binding') : t('profile.params.bind.unbound')"
        :action-text="store.info.openId ? t('profile.params.bind.change') : t('profile.params.bind.title')"
        @action="showForm('wechat')"
      />

      <FormField
        :label="t('profile.form.label.phone')" class="mb-4"
        :value="store.info.phone || t('profile.params.bind.unbound')"
        :action-text="store.info.phone ? t('profile.edit') : t('profile.params.bind.title')"
        @action="showForm('phone')"
      />

      <FormField
        :label="t('profile.form.label.email')" class="mb-4"
        :value="store.info.email || t('profile.params.bind.unbound')"
        :action-text="store.info.email ? t('profile.edit') : t('profile.params.bind.title')"
        @action="showForm('email')"
      />

      <FormField
        class="mb-4"
        :label="t('profile.form.label.pwd')" :action-text="t('profile.edit')"
        value="********" type="password"
        @action="showForm('password')"
      />

      <Transition name="fade-in">
        <div
          v-if="activeForm"
          class="absolute inset-0 bg-card p-4 border rounded-md"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">{{ activeTitle }}</h3>
            <button
              :class="twJoin(
                'p-2 text-muted-foreground rounded-full',
                'hover:text-primary hover:bg-primary/20',
              )"
              @click="closeForm"
            >
              <Icon icon="lucide:x" class="size-4" />
            </button>
          </div>

          <WechatForm v-if="activeForm === 'wechat'" />
          <AccountForm v-else-if="activeForm === 'account'" :on-close="closeForm" />
          <PhoneForm v-else-if="activeForm === 'phone'" :on-close="closeForm" />
          <EmailForm v-else-if="activeForm === 'email'" :on-close="closeForm" />
          <PasswordForm v-else :on-close="closeForm" />
        </div>
      </Transition>
    </div>
  </section>
</template>
