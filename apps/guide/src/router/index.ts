import { createRouter, createWebHistory } from 'vue-router'

import guide from './routes/desktop'
import { getDeviceType } from '@/utils/ua'
import guideMobile from './routes/mobile'

const REST_ROUTES = getDeviceType() ? guideMobile : guide
const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...REST_ROUTES
  ],

})

export default router
