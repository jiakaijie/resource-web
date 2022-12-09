import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/resource/list'
  },
  {
    path: '/resource',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home/Index.vue'),
    children: [
      {
        path: '/resource/list',
        component: () => import(/* webpackChunkName: "stu" */ '../views/Resource/Index.vue')
      },
      {
        path: '/resource/edite',
        component: () => import(/* webpackChunkName: "stuDetails" */ '../views/Resource/Edite.vue')
      },
      {
        path: '/user/list',
        component: () => import(/* webpackChunkName: "buWeChat" */ '../views/User/Index.vue')
      },
      {
        path: '/other',
        component: () => import(/* webpackChunkName: "buWeChat" */ '../views/Other/Index.vue')
      },
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login/Index.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
