import { createRouter, createWebHashHistory } from 'vue-router'

import guide from './routes/desktop'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...guide,
  ],

})

export default router

