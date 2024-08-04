import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '@/layouts/SignIn.vue';
import Inside from '@/layouts/Inside.vue';
import Dashboard from '@/layouts/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Inside,
      meta: { transition: 'slide-left' },
    },
    {
      path: '/login',
      name: 'login',
      component: SignIn,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/restaurants',
      children: [
        {
          path: '',
          name: 'restaurants',
          component: () => import('@/layouts/Dashboard.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: () => (window.location.pathname = import.meta.env.BASE_URL),
    },
  ],
});

export default router;
