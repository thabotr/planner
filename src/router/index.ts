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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import('../views/PlanView.vue')
    },
    {
      path: '/plan/2',
      name: 'plan2',
      component: () => import('../views/PlanView2.vue')
    }
  ]
})

export default router
