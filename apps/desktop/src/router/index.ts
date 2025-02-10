import { createRouter, createWebHistory } from 'vue-router'
import notFound from './routes/notFound'
import auth from './routes/auth'
import home from './routes/home'
import test from './routes/test'

const isDev = import.meta.env.DEV
const router = createRouter({
  history: createWebHistory(),
  routes: [
    notFound, auth, home,
    ...(isDev ? [test] : [])
  ],
})

// router.beforeEach((to) => {
//   const key = import.meta.env.VITE_ACCESS_TOKEN
//   const token = localStorage.getItem(key)
//   const isAuth = to.path.includes('auth')

//   if (!isAuth && !token) return '/auth'
//   if (isAuth && token) return '/'
// })

export default router
