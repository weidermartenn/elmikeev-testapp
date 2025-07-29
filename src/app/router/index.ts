import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomePage.vue')
    },
    {
      path: '/incomes',
      name: 'incomes',
      component: () => import('@/pages/incomes/ui/IncomesPage.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/orders/ui/OrdersPage.vue')
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('@/pages/sales/ui/SalesPage.vue')
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('@/pages/stocks/ui/StocksPage.vue')
    },
  ],
})

export default router
