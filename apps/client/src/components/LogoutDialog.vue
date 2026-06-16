<script setup lang="ts">
const iStore = useSystemStore()
const uStore = useUserStore()
const localStore = useLocalStore()

function handleLogout() {
  iStore.logout = false
  uStore.isAdminLogin = false
  uStore.logout()
}
</script>

<template>
  <XDialog
    uiRoot="w-64 p-6 rounded-2xl shadow-xl"
    :closeBtn="false"
    :maskClosable="false"
    v-model="iStore.logout"
  >
    <template #header>
      <h2 class="text-lg font-semibold text-center text-gray-900 mb-2">{{ localStore.localData['top_Prompt'] }}</h2>
    </template>

    <template #default>
      <p class="text-sm text-center text-gray-600 mb-6">{{ localStore.localData['top_LogOut'] }}</p>
    </template>

    <template #footer>
      <div class="flex justify-around gap-4">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="iStore.logout = false" @confirm="handleLogout"
        />
      </div>
    </template>
  </XDialog>
</template>
