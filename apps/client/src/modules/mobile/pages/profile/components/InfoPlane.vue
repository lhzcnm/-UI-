<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { maskText } from '@/utils'
// import { ua } from '@3un/utils'

const store = useUserStore()

console.log(store)

const { t } = useI18n()
</script>

<template>
  <SlideRight :title="t('profile.mobile.title.account')">
    <div class="px-6 mt-3">
      <div class="bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-600 dark:to-zinc-800 text-white rounded-xl p-5 shadow-lg">
        <div class="flex items-center space-x-2 text-sm opacity-80">
          <Icon icon="lucide:wallet" class="size-5" />
          <span>{{ t('profile.stat.balance') }}</span>
        </div>
        <div class="flex items-center mt-2">
          <span class="text-3xl font-bold tracking-tight">{{ store.info.credits }}</span>
          <span class="text-sm ml-1 opacity-80">￥</span>
        </div>
        <div class="flex justify-between mt-3 text-sm">
          <div>{{ t('profile.stat.amount') }} <span class="font-semibold">{{ store.info.totalReceipts }}</span></div>
          <div>{{ t('profile.stat.lock') }} <span class="font-semibold text-amber-500 dark:text-amber-300">{{ store.info.rechargeCount }}</span></div>
        </div>
      </div>
    </div>

    <div class="my-4 px-6">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div class="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon icon="lucide:shopping-cart" class="size-4" />
            <span>{{ t('profile.stat.order') }}</span>
          </div>
          <div class="flex items-center">
            <data class="text-2xl font-bold text-card-foreground" :value="store.info.userOrder.total">
              {{ store.info.userOrder.total }}
            </data>
            <span class="text-sm text-muted-foreground ml-1">{{ t('profile.stat.piece') }}</span>
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <span class="text-success">{{ t('profile.stat.success') }} {{ store.info.userOrder.success }}</span>
            <span class="text-danger">{{ t('profile.stat.fail') }} {{ store.info.userOrder.failed }}</span>
          </div>
        </div>

        <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div class="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon icon="lucide:calendar" class="size-4" />
            <span>{{ t('profile.stat.useDay') }}</span>
          </div>
          <div class="flex items-center">
            <data class="text-2xl font-bold text-card-foreground" :value="store.info.usageDays">
              {{ store.info.usageDays }}
            </data>
            <span class="text-sm text-muted-foreground ml-1">{{ t('profile.stat.day') }}</span>
          </div>
        </div>

        <div class="col-span-2 bg-card rounded-xl p-4 shadow-sm border border-border">
          <div class="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon icon="lucide:award" class="size-4" />
            <span>{{ t('profile.stat.memberExpire') }}</span>
          </div>
          <div class="flex items-center justify-between">
            <data class="text-xl font-bold text-card-foreground" :value="store.info.memberExp">
              {{ store.info.memberExp || t('profile.stat.notActivate') }}
            </data>
            <RouterLink
              to="/recharge/membership"
              class="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {{ store.info.memberExp ? t('profile.stat.reNewal') : t('profile.stat.activateNow') }}
            </RouterLink>
          </div>
        </div>

        <div class="col-span-2 bg-card rounded-xl p-4 shadow-sm border border-border">
          <div class="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Icon icon="lucide:shield-plus" class="size-4" />
            <span>{{ t('profile.mobile.info.title') }}</span>
          </div>
          <div class="text-sm text-muted-foreground">
            <div>{{ t('profile.mobile.info.account') }}: {{ store.info.username }}</div>
            <div class="font-mono">{{ t('profile.mobile.info.wechat') }}: {{ t('profile.form.bind.not') }}</div>
            <div>{{ t('profile.mobile.info.phone') }}: {{ store.info.phone || t('profile.form.bind.not') }}</div>
            <div>{{ t('profile.mobile.info.mail') }}: {{ store.info.email || t('profile.form.bind.not') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="!ua.isMobile" class="p-6 mb-4">
      <XButton
        icon="lucide:log-out"
        :label="t('barItem.logout')" color="danger"
        variant="soft" class="w-full"
        @click="store.logout"
      />
    </div> -->
  </SlideRight>
</template>
