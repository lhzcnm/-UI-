import type { RouteRecordRaw } from 'vue-router'
import Default from '@/layouts/default.vue'

const home: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: Default,
  children: [
    {
      path: '',
      name: 'Services',
      component: () => import('@/pages/home/index.vue'),
    },
    {
      path: 'submit/:id?',
      name: 'Submit',
      component: () => import('@/pages/submit/index.vue'),
    },
    {
      path: 'history',
      name: 'History',
      component: () => import('@/pages/history/index.vue'),
    },
    {
      path: 'ticket',
      name: 'Ticket',
      component: () => import('@/pages/ticket/index.vue'),
    },
    {
      path: 'profile',
      name: 'Profile',
      component: () => import('@/pages/profile/index.vue'),
    },
  ]
}

export default home
