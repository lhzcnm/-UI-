<script setup lang="ts">
import { Icon } from '@iconify/vue'

import FormField from './FormField.vue'
import UserCard from './UserCard.vue'

import type { Action } from '../types'
import { twJoin } from 'tailwind-merge'

const store = useUserStore()

const activeForm = ref<Action | null>(null)
const activeTitle = computed(() => {
  if (activeForm.value === 'phone') return '修改手机号'
  if (activeForm.value === 'email') return '修改邮箱'
  if (activeForm.value === 'wechat') return '微信绑定'
  return '修改密码'
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
        label="微信" class="mb-4"
        :value="store.info.openId ? '已绑定' : '未绑定'"
        :action-text="store.info.openId ? '换绑' : '绑定'"
        @action="showForm('wechat')"
      />

      <FormField
        label="手机号" class="mb-4"
        :value="store.info.phone || '未绑定'"
        :action-text="store.info.phone ? '修改' : '绑定'"
        @action="showForm('phone')"
      />

      <FormField
        label="邮箱" class="mb-4"
        :value="store.info.email || '未绑定'"
        :action-text="store.info.email ? '修改' : '绑定'"
        @action="showForm('email')"
      />

      <FormField
        class="mb-4"
        label="密码" action-text="修改"
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
          <PhoneForm v-else-if="activeForm === 'phone'" :on-close="closeForm" />
          <EmailForm v-else-if="activeForm === 'email'" :on-close="closeForm" />
          <PasswordForm v-else :on-close="closeForm" />
        </div>
      </Transition>
    </div>
  </section>
</template>
