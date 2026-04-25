<script setup lang="ts">
import authApi from '@auth/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const uStore = useUserStore()

const prompt = ref(t('auth.ticket.loading'))
const loading = ref(false)

const tokenKey = import.meta.env.VITE_ADMIN_TOKEN

async function handleTicketAuth(ticket: string) {
  if (loading.value) return
  loading.value = true

  try {
    const { data } = await authApi.ticketAuth({ code: ticket })

    // prompt.value = '登录成功，正在跳转...'
    prompt.value = t('auth.ticket.success')

    sessionStorage.setItem(tokenKey, data)
    uStore.isAdminLogin = true

    setTimeout(() => {
      router.replace('/')
    }, 800)
  } catch (e) {
    // prompt.value = '登录失败，正在跳转登录页...'
    prompt.value = t('auth.ticket.failed')
    uStore.isAdminLogin = false

    setTimeout(() => {
      router.replace('/auth')
    }, 800)
  }
}

onMounted(() => {
  const ticket = route.query.ticket

  if (!ticket || typeof ticket !== 'string') {
    uStore.isAdminLogin = false
    router.replace('/auth')
    return
  }

  handleTicketAuth(ticket)
})
</script>

<template>
  <div class="flex items-center justify-center h-screen text-xl text-gray-500">
    {{ prompt }}
  </div>
</template>
