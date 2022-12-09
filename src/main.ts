import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css'
import 'element-plus/dist/index.css'

createApp(App)
  .use(ElementPlus, {
    locale: zhCn
  })
  .use(store)
  .use(router)
  .mount('#app')
