import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** true: 로그인한 사용자만 접근 / false: 로그아웃 상태에서만 접근(로그인 화면 등) */
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  // history 모드: JCloud nginx 에서 모든 경로를 index.html 로 넘기도록 설정해야 새로고침이 동작한다
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.waitUntilReady()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // 로그인 후 원래 가려던 화면으로 돌아갈 수 있게 경로를 넘긴다
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
