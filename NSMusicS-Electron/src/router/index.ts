import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/View_Home_MusicLibrary_Browse',
      name: 'View_Home_MusicLibrary_Browse',
      component: () => import('../views/view_page_home/View_Home_MusicLibrary_Browse.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Menu_AppSetting',
      name: 'View_Menu_AppSetting',
      component: () => import('../views/view_page_menu/View_Menu_AppSetting.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Song_List_ALL',
      name: 'View_Song_List_ALL',
      component: () => import('../views/view_page_media/View_Song_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Album_List_ALL',
      name: 'View_Album_List_ALL',
      component: () => import('../views/view_page_album/View_Album_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Artist_List_ALL',
      name: 'View_Artist_List_ALL',
      component: () => import('../views/view_page_artist/View_Artist_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/View_Updateing',
      name: 'View_Updateing',
      component: () => import('../components/update_list/View_Updateing.vue'),
      meta: {
        cleanup: true
      }
    }
  ]
})
export default router