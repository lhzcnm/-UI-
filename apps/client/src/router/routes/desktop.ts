import type { RouteRecordRaw } from 'vue-router'

const home: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: () => import('@desktop/index.vue'),
  children: [
    {
      path: '',
      name: 'Services',
      component: () => import('@desktop/pages/home/index.vue'),
    },
    {
      name: 'Submit',
      path: 'submit/:id(\\d{4})?/:imei?',
      component: () => import('@desktop/pages/submit/index.vue'),
      props: true,
    },
    {
      path: 'history',
      name: 'History',
      component: () => import('@desktop/pages/history/index.vue'),
    },
    {
      name: 'Recharge',
      path: 'recharge/:tab?',
      component: () => import('@desktop/pages/recharge/index.vue'),
      props: true,
    },
    {
      path: 'ticket',
      name: 'Ticket',
      component: () => import('@desktop/pages/ticket/index.vue'),
    },
    {
      path: 'credits',
      name: 'Credits',
      component: () => import('@desktop/pages/credits/index.vue'),
    },
    {
      path: 'profile',
      name: 'Profile',
      component: () => import('@desktop/pages/profile/index.vue'),
    },
    {
      path: 'store',
      name: 'Store',
      component: () => import('@desktop/pages/store/index.vue'),
      meta: {
        hideHeader: true,
        hideSidebar: true,
        noAuthRequired: true,
      },
    },
  ]
}

if (import.meta.env.VITE_APP_DEVICE === 'true') {
  home.children && home.children.push({
    path: 'device', name: 'Device',
    component: () => import('@desktop/pages/device/index.vue'),
  })
}
export default home
