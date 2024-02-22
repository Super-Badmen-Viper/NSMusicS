import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/View_Album_List_ALL',
      name: 'View_Album_List_ALL',
      component: () => import('../views/View_Album_List_ALL.vue'),
      meta: {
        // 添加 meta 字段用于标记路由是否已经清理
        cleanup: true
      }
    },
    {
      path: '/View_Song_List_ALL',
      name: 'View_Song_List_ALL',
      component: () => import('../views/View_Song_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
  ]
})

export default router
