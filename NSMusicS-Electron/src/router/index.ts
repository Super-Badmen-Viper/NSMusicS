import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/view_page_home/View_Home_MusicLibrary_Browse.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/apps',
      name: 'apps',
      component: () => import('../views/view_page_setting/View_Menu_AppSetting.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/song',
      name: 'song',
      component: () => import('../views/view_page_media/View_Song_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('../views/view_page_album/View_Album_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/artist',
      name: 'artist',
      component: () => import('../views/view_page_artist/View_Artist_List_ALL.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('../views/view_page_server_setting/View_Server_Setting.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/view_page_server_library/View_Server_Library.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('../components/update_list/View_Updateing.vue'),
      meta: {
        cleanup: true
      }
    }
  ]
})
export default router