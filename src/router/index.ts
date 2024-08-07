import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SignIn from '@/layouts/SignIn.vue';
import Inside from '@/layouts/Inside.vue';
import Dashboard from '@/layouts/Dashboard.vue';
import RestaurantLayout from '@/layouts/RestaurantLayout.vue';
import Restaurants from '@/components/atoms/restaurants/Restaurants.vue';
import AddRestaurants from '@/components/atoms/restaurants/AddRestaurants.vue';
import EditRestaurants from '@/components/atoms/restaurants/EditRestaurants.vue';

export const menusApp: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      return { path: '/login' };
    },
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
    component: RestaurantLayout,
    children: [
      {
        path: '',
        name: 'restaurants',
        component: Restaurants,
      },
      {
        path: '/add',
        name: 'add-restaurant',
        component: AddRestaurants,
      },
      {
        path: '/edit',
        name: 'edit-restaurant',
        component: EditRestaurants,
      },
      {
        path: '/edit/:id',
        name: 'edit-restaurant-single',
        component: EditRestaurants,
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
