<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TheHeader from './components/TheHeader.vue'

const route = useRoute()

const menus = [
  {
    icon: 'lucide:home',
    label: '仪表盘',
    path: '/dashboard',
  },
  {
    icon: 'lucide:users',
    label: '用户管理',
    path: '/users',
    children: [
      {
        label: '会员',
        path: 'all',
      },
      {
        label: '管理员',
        path: 'admin',
      },
      {
        label: '会员等级',
        path: 'level',
      },
    ],
  },
  {
    icon: 'lucide:package-2',
    label: '服务管理',
    path: '/service',
    children: [
      {
        label: '字段分割',
        path: 'fields',
      },
      {
        label: '服务组',
        path: 'groups',
      },
      {
        label: '服务',
        path: 'items',
      },
    ],
  },
  {
    icon: 'lucide:shopping-bag',
    label: '订单管理',
    path: '/orders',
    children: [
      {
        label: '全部',
        path: 'all',
      },
      {
        label: '订单验证',
        path: 'verify',
      },
      {
        label: '等待处理',
        path: 'pending',
      },
      {
        label: '正在处理',
        path: 'processing',
      },
    ],
  },
  {
    icon: 'lucide:credit-card',
    label: '充值管理',
    path: '/recharge',
    children: [
      {
        label: '会员充值',
        path: 'all',
      },
      {
        label: '今日充值',
        path: 'today',
      },
      {
        label: '管理员充值',
        path: 'admin',
      },
    ],
  },
  {
    icon: 'lucide:hard-drive',
    label: '日志管理',
    path: '/logs',
    children: [
      {
        label: '用户登录日志',
        path: 'user',
      },
      {
        label: '管理员登录日志',
        path: 'admin',
      },
    ],
  },
  {
    icon: 'lucide:messages-square',
    label: '工单管理',
    path: '/tickets',
  },
  {
    icon: 'lucide:plug-zap',
    label: 'API 管理',
    path: '/interface',
  },
  {
    icon: 'lucide:pocket',
    label: '拦截管理',
    path: '/intercept',
  },
]
</script>

<template>
  <div class="flex h-screen">
    <Sidebar :menus="menus" />
    <div class="flex-1 flex flex-col">
      <TheHeader />
      <RouterView v-slot="{ Component }" :key="route.path">
        <main v-if="Component" class="flex-1 overflow-y-auto">
          <Transition name="fade-in" mode="out-in">
            <Suspense>
              <component :is="Component" />
  
              <template #fallback>
                <Fallback />
              </template>
            </Suspense>
          </Transition>
        </main>
      </RouterView>
    </div>
  </div>
</template>
