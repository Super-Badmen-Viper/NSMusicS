import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
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
    {
      path: '/View_Album_List_ALL',
      name: 'View_Album_List_ALL',
      component: () => import('../views/View_Album_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Artist_List_ALL',
      name: 'View_Artist_List_ALL',
      component: () => import('../views/View_Artist_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    }
  ]
})

export default router