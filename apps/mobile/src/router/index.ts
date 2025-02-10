import { createRouter, createWebHistory } from 'vue-router'
import auth from './routes/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [auth],
})

router.beforeEach((to) => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key)
  const isAuth = to.path.includes('auth')

  if (!isAuth && !token) return '/auth'
  if (isAuth && token) return '/'
})

export default router
