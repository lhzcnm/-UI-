<script setup lang="ts">
import type { LoginMode } from '../types'

import { encrypt } from '@3un/utils'
import { toast } from 'vue-sonner'
import authApi from '@/api/auth'

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()
const store = useSettingStore()

const form = reactive({
  username: '',
  password: '',
})

function rules(data: typeof form) {
  const { username, password } = data
  return [
    { rule: !!username.trim(), message: '请输入用户名' },
    { rule: !!password.trim(), message: '请输入密码' },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

defineExpose({
  login(id: string) {
    const password = encrypt(form.password)
    if (!password) return

    const key = import.meta.env.VITE_ACCESS_TOKEN
    const body = { username: form.username, password, id }
    const response = authApi.accountLogin(body)

    response.then(async ({ data }) => {
      localStorage.setItem(key, data)
      await router.push('/')
    })
  }
})

function toRegister() {
  const flag = store.settings.enableRegister
  if (flag) router.push('/auth/register')
  else toast.info('注册功能，暂未开放')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">账号登录</h2>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <XInput v-model="form.username" placeholder="用户名" />
      <XInput v-model="form.password" type="password" placeholder="密码 / API KEY" />
      <XButton class="w-full" label="登录" type="submit" />
    </form>
    <div class="flex items-center justify-between mt-3 text-muted-foreground text-sm">
      <span>没有账号？<a href="javascript:void(0)" class="hover:underline" @click="toRegister">立即注册</a></span>
      <RouterLink class="hover:underline" to="/auth/forgot">忘记密码?</RouterLink>
    </div>
    <div class="mt-6 text-center">
      <hr class="hr-fade-content text-muted-foreground mb-2" data-content="第三方登录方式">
      <div class="flex items-center justify-center gap-2 select-none">
        <a href="javascript:void(0)" @click="mode = 'wechat'">
          <img class="size-10 sm:size-9" src="/icons/wechat.svg" alt="wechat" draggable="false">
        </a>
        <a href="javascript:void(0)" @click="mode = 'phone'">
          <img class="size-10 sm:size-9" src="/icons/phone.svg" alt="phone" draggable="false">
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.hr-fade-content {
  position: relative;
  padding: 1em 0;
  font-size: .85rem; border: 0;
  -webkit-mask-image: linear-gradient(to right, transparent, black, transparent);
  mask-image: linear-gradient(to right, transparent, black, transparent);

  &::before {
    content: attr(data-content);
    position: absolute;
    padding: 0 1ch;
    line-height: 1px;
    border: solid var(--border);
    border-width: 0 99vw;
    width: fit-content;
    white-space: nowrap; left: 50%;
    transform: translateX(-50%);
  }
}
</style>
