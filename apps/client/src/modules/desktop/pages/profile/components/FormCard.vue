<script setup lang="ts">
import { Icon } from '@iconify/vue'

import FormField from './FormField.vue'
import UserCard from './UserCard.vue'

import type { Action } from '../types'
import { twJoin } from 'tailwind-merge'
import { PROFILE_TYPE, VALID_TYPE } from '../types'
import { toast } from 'vue-sonner'
import { PROFILE_STORE } from '../utils'

const store = inject(PROFILE_STORE)!
const ustore = useUserStore()

const localStore = useLocalStore()

const activeForm = ref<Action | null>(null)
const activeTitle = computed(() => {
  const options = {
    account:localStore.localData['profile_TitleAccount'],
    password: localStore.localData['profile_TitlePwd'],
    phone: localStore.localData['profile_TitlePhone'],
    email: localStore.localData['profile_TitleEmail'],
    wechat: localStore.localData['profile_TitleWechat'],
  }

  return options[activeForm.value as Action]
})

function showForm(type: Action) {
  activeForm.value = type
}

function closeForm() {
  activeForm.value = null
}

function openUnbind(type: PROFILE_TYPE) {
  const { phone, email } = ustore.info
  if (type === PROFILE_TYPE.WECHAT && !phone && !email) {
    return toast.warning("请先绑定手机号或者邮箱")
  }

  store.code = ""
  store.unBindType = type
  store.isGetCode = false
  store.validType = VALID_TYPE.PHONE
  store.loading = false
  store.visibleUnBind = true
}
</script>

<template>
  <section class="w-[24rem] shrink-0 p-4">
    <UserCard />

    <div class="relative mt-4">
      <FormField
        :label="localStore.localData['profile_LabelAccount']" class="mb-4"
        :action-text="localStore.localData['profile_edit']"
        :value="ustore.info.username"
        @action="showForm('account')"
      />

      <!-- <FormField
        :label="t('profile.form.label.wechat')" class="mb-4"
        :value="store.info.openId ? t('profile.params.bind.change') : t('profile.params.bind.title')"
        :action-text="store.info.openId ? t('profile.params.bind.change') : t('profile.params.bind.title')"
        @action="showForm('wechat')"
      /> -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm text-muted-foreground">{{ localStore.localData['profile_LabelWechat'] }}</span>
          <div class="flex space-x-2">
            <a
              v-if="ustore.info.openId"
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="openUnbind(1)">
              {{ localStore.localData['profile_BindUn'] }}
            </a>
            <a
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="showForm('wechat')"
            >
              {{ ustore.info.openId ? localStore.localData['profile_BindChange'] : localStore.localData['profile_BindTitle'] }}
            </a>
          </div>
        </div>
        <input
          :value="ustore.info.openId ? localStore.localData['profile_BindBinding'] : localStore.localData['profile_BindUnbound']" type="text" readonly
          class="w-full h-9 px-2.5 text-sm border rounded-md outline-none bg-muted/80"
        />
      </div>

      <!-- <FormField
        :label="t('profile.form.label.phone')" class="mb-4"
        :value="store.info.phone || t('profile.params.bind.unbound')"
        :action-text="store.info.phone ? t('profile.edit') : t('profile.params.bind.title')"
        @action="showForm('phone')"
      /> -->

      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm text-muted-foreground">{{ localStore.localData['profile_LabelPhone'] }}</span>
          <div class="flex space-x-2">
            <a
              v-if="ustore.info.phone"
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="openUnbind(2)">
              {{ localStore.localData['profile_BindUn'] }}
            </a>
            <a
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="showForm('phone')"
            >
              {{ ustore.info.phone ? localStore.localData['profile_edit'] : localStore.localData['profile_BindTitle	'] }}
            </a>
          </div>
        </div>
        <input
          :value="ustore.info.phone || localStore.localData['profile_BindUnbound']" type="text" readonly
          class="w-full h-9 px-2.5 text-sm border rounded-md outline-none bg-muted/80"
        />
      </div>

      <!-- <FormField
        :label="t('profile.form.label.email')" class="mb-4"
        :value="store.info.email || t('profile.params.bind.unbound')"
        :action-text="store.info.email ? t('profile.edit') : t('profile.params.bind.title')"
        @action="showForm('email')"
      /> -->

      <div class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm text-muted-foreground">{{ localStore.localData['profile_LabelEmail'] }}</span>
          <div class="flex space-x-2">
            <a
              v-if="ustore.info.email"
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="openUnbind(3)">
              {{ localStore.localData['profile_BindUn'] }}
            </a>
            <a
              href="javascript:void(0)"
              class="text-sm text-primary hover:underline"
              @click="showForm('email')"
            >
              {{ ustore.info.email ? localStore.localData['profile_edit'] : localStore.localData['profile_BindTitle'] }}
            </a>
          </div>
        </div>
        <input
          :value="ustore.info.email || localStore.localData['profile_BindUnbound']" type="text" readonly
          class="w-full h-9 px-2.5 text-sm border rounded-md outline-none bg-muted/80"
        />
      </div>

      <FormField
        class="mb-4"
        :label="localStore.localData['profile_LabelPwd']" :action-text="localStore.localData['profile_edit']"
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
