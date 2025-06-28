import type { RouteRecordRaw } from 'vue-router'

const desktop: RouteRecordRaw = {
  path: '/',
  name: 'Desktop',
  redirect: '/dashboard',
  component: () => import('@desktop/index.vue'),
  children: [
    // 用户管理
    {
      path: 'users',
      name: 'AllUser',
      component: () => import('@desktop/pages/users/index.vue'),
    },
    {
      path: 'users/level',
      name: 'AllLevel',
      component: () => import('@desktop/pages/users/level.vue'),
    },
    {
      path: 'users/paid',
      name: 'AllPaid',
      component: () => import('@desktop/pages/users/paid.vue'),
    },
    // 服务管理
    {
      path: 'service/groups',
      name: 'AllGroup',
      component: () => import('@desktop/pages/service/groups.vue'),
    },
    {
      path: 'service/items',
      name: 'AllItem',
      component: () => import('@desktop/pages/service/items.vue'),
    },
    {
      path: 'service/fields',
      name: 'AllField',
      component: () => import('@desktop/pages/service/fields.vue'),
    },
    {
      path: 'service/unlock',
      name: 'Unlock',
      component: () => import('@desktop/pages/service/unlock.vue'),
    },
    // 微信管理
    {
      path: 'wechat/menu',
      component: () => import('@desktop/pages/wechat/menu.vue'),
    },
    {
      path: 'wechat/message',
      component: () => import('@desktop/pages/wechat/message.vue'),
    },
    // 订单管理
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('@desktop/pages/orders/index.vue'),
    },
    {
      path: '/orders/verify',
      name: 'OrdersVerify',
      component: () => import('@desktop/pages/orders/verify.vue'),
    },
    // 工具
    {
      path: 'editor',
      name: 'Editor',
      component: () => import('@desktop/pages/editor/index.vue'),
    },
    {
      path: 'batch-edit-orders',
      name: 'BatchEditOrders',
      component: () => import('@desktop/pages/orders-edit/index.vue'),
    },
    // 充值管理
    {
      path: 'recharge',
      name: 'Recharge',
      component: () => import('@desktop/pages/recharge/index.vue'),
    },
    {
      path: 'recharge/packages',
      name: 'RechargePackages',
      component: () => import('@desktop/pages/recharge/packages.vue'),
    },
    // 其他页面
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@desktop/pages/dashboard/index.vue'),
    },
    {
      path: 'tickets',
      name: 'Tickets',
      component: () => import('@desktop/pages/tickets/index.vue'),
    },
    {
      path: 'upstream',
      name: 'Upstream',
      component: () => import('@desktop/pages/upstream/index.vue'),
    },
    {
      path: 'intercept',
      name: 'Intercept',
      component: () => import('@desktop/pages/intercept/index.vue'),
    },
    {
      path: 'logs',
      name: 'Logs',
      component: () => import('@desktop/pages/logs/index.vue'),
    },
    {
      path: 'credits',
      name: 'Credits',
      component: () => import('@desktop/pages/credits/index.vue'),
    },
  ],
}

export default desktop
