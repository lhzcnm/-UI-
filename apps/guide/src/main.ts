import './assets/index.css'
import './assets/tiptap.css'

import { createApp } from 'vue'
import App from './App.vue'

import * as UI from '@3un/ui'
import router from './router'

const app = createApp(App)

Object.entries(UI).forEach(([name, component]) => {
  if (typeof component === "object" || typeof component === "function") {
    app.component(name, component as any)
  }
})

app.use(router)
app.mount('#app')