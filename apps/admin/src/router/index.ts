import { createRouter, createWebHistory } from 'vue-router'

import notFound from './routes/404'
import desktop from './routes/desktop'
import mobile from './routes/mobile'
import { ua } from '@3un/utils'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    notFound,
    ua.isMobile
      ? mobile
      : desktop,
  ],
})

router.beforeEach((to) => {
  const key = import.meta.env.VITE_TOKEN
  const token = localStorage.getItem(key) || sessionStorage.getItem(key)

  // handle auth
  const isAuth = to.path.includes('auth')
  if (!isAuth && !token) return '/auth'
  if (isAuth && token) return '/dashboard'

  const isMobilePath = to.path.startsWith('/m')

  // is mobile and not mobile path
  if (ua.isMobile && !isMobilePath) {
    if (!token) return '/m/auth'
    return to.path.length > 1 ? `/m${to.path}` : '/m'
  }

  // is pc and is mobile path
  if (!ua.isMobile && isMobilePath) {
    if (!token) return '/auth'
    return to.path.replace('/m', '')
  }
})

export default router
