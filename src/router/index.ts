import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/View_Home_MusicLibrary_Browse',
      name: 'View_Home_MusicLibrary_Browse',
      component: () => import('../views/View_Home_MusicLibrary_Browse.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Menu_AppSetting',
      name: 'View_Menu_AppSetting',
      component: () => import('../views/View_Menu_AppSetting.vue'),
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
    },
    {
      path: '/View_Updateing',
      name: 'View_Updateing',
      component: () => import('../views/View_Updateing.vue'),
      meta: {
        cleanup: true
      }
    }
  ]
})

export default router