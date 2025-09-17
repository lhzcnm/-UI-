<script setup lang="ts">
const iStore = useSystemStore()
const uStore = useUserStore()
const { t } = useI18n()

function handleLogout() {
  iStore.logout = false
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
      <h2 class="text-lg font-semibold text-center text-gray-900 mb-2">{{ t('prompt.title') }}</h2>
    </template>

    <template #default>
      <p class="text-sm text-center text-gray-600 mb-6">{{ t('prompt.confirm', { action: t('barItem.logout') }) }}</p>
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
