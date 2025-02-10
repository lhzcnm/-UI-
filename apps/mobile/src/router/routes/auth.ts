import type { RouteRecordRaw } from 'vue-router'
import Auth from '@/layouts/auth.vue'

const auth: RouteRecordRaw = {
  path: '/auth',
  name: 'Auth',
  component: Auth,
  children: [
    {
      path: '',
      name: 'Login',
      component: () => import('@/pages/auth/Login.vue'),
    },
    {
      path: 'forgot',
      name: 'Forgot',
      component: () => import('@/pages/auth/Forgot.vue'),
    },
    {
      path: 'register',
      name: 'Register',
      component: () => import('@/pages/auth/Register.vue'),
    },
  ],
}

export default auth
