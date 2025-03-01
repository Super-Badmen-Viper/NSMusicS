import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: {
        cleanup: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/router/router_views/router_server/View_Server_Login.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/router/router_views/router_music/Router_Home.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/apps',
      name: 'apps',
      component: () => import('@/router/router_views/router_music/Router_Setting.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/song',
      name: 'song',
      component: () => import('@/router/router_views/router_music/Router_Media.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('@/router/router_views/router_music/Router_Album.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/artist',
      name: 'artist',
      component: () => import('@/router/router_views/router_music/Router_Artist.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/genre',
      name: 'genre',
      component: () => import('@/router/router_views/router_music/Router_Genre.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('@/router/router_views/router_server/View_Server_Setting.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/router/router_views/router_server/View_Server_Library.vue'),
      meta: {
        cleanup: true
      }
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('@/router/router_views/View_Updateing.vue'),
      meta: {
        cleanup: true
      }
    }
  ]
})
export default router