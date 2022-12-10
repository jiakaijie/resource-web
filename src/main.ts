import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  app.component(key, component)
}

app.use(ElementPlus, {
    locale: zhCn
  })
  .use(store)
  .use(router)
  .mount('#app')
