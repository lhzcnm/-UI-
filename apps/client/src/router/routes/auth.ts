import type { RouteRecordRaw } from 'vue-router'

const auth: RouteRecordRaw = {
  path: '/auth',
  name: 'Auth',
  component: () => import('@auth/index.vue'),
  children: [
    {
      path: '',
      name: 'Login',
      component: () => import('@auth/pages/login/index.vue'),
    },
    {
      path: 'forgot',
      name: 'Forgot',
      component: () => import('@auth/pages/forgot/index.vue'),
    },
    {
      path: 'register',
      name: 'Register',
      component: () => import('@auth/pages/register/index.vue'),
    },
  ],
}

export default auth
