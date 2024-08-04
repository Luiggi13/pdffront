import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SignIn from '@/layouts/SignIn.vue';
import Inside from '@/layouts/Inside.vue';
import Dashboard from '@/layouts/Dashboard.vue';
import RestaurantLayout from '@/layouts/RestaurantLayout.vue';

export const menusApp: RouteRecordRaw[] = [
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
        component: RestaurantLayout,
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/HomeView.vue'),
    beforeEnter: () => (window.location.pathname = import.meta.env.BASE_URL),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: menusApp,
});

export default router;
