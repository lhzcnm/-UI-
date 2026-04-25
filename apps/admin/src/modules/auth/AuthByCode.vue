<script setup lang="ts">
import { codeExToken } from '@/api/domain'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const uStore = useUserStore()

const prompt = ref<string>('正在为您自动登录...')
const loading = ref<boolean>(false)

const adminKey = import.meta.env.VITE_ADMIN_TOKEN

async function handleCodeAuth(code: string) {
  if (loading.value) return

  loading.value = true

  try {
    const token = await codeExToken({ code: code })
    prompt.value = '登录成功, 正在跳转...'
    uStore.isAdminAuth = true

    sessionStorage.setItem(adminKey, token)
    uStore.isAdminAuth = true

    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch {
    prompt.value = '登录失败, 正在跳转登录页...'
    uStore.isAdminAuth = false

    setTimeout(() => {
      router.push('/auth')
    }, 800)
  }
}

onMounted(() => {
  const code = route.query.code

  if (!code || typeof code !== 'string') {
    uStore.isAdminAuth = false
    router.replace('/auth')
    return
  }

  handleCodeAuth(code)
})
</script>

<template>
  <div class="flex items-center justify-center h-screen text-xl text-gray-500">
    {{ prompt }}
  </div>
</template>
