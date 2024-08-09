import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SignIn from '@/layouts/SignIn.vue';
import Inside from '@/layouts/Inside.vue';
import Dashboard from '@/layouts/Dashboard.vue';
import RestaurantLayout from '@/layouts/RestaurantLayout.vue';
import Restaurants from '@/components/atoms/restaurants/Restaurants.vue';
import AddRestaurants from '@/components/atoms/restaurants/AddRestaurants.vue';
import EditRestaurants from '@/components/atoms/restaurants/EditRestaurants.vue';
import DeleteRestaurants from '@/components/atoms/restaurants/DeleteRestaurants.vue';
import { useAuthStore } from '@/stores/authStore';

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
    beforeEnter: () => {
      if (useAuthStore().isLoggedIn === false) router.push('/login');
    },
  },
  {
    path: '/restaurants',
    component: RestaurantLayout,
    children: [
      {
        path: '',
        name: 'restaurants',
        component: DeleteRestaurants,
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false) router.push('/login');
          if (useAuthStore().isPremium === false) router.push('/dashboard');
        },
      },
      {
        path: '/add',
        name: 'add-restaurant',
        component: AddRestaurants,
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false) router.push('/login');
        },
      },
      {
        path: '/edit',
        name: 'edit-restaurant',
        component: EditRestaurants,
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false) router.push('/login');
        },
      },
      {
        path: '/edit/:id',
        name: 'edit-restaurant-single',
        component: EditRestaurants,
      },
      {
        path: '/actions',
        name: 'actions-restaurant',
        component: DeleteRestaurants,
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false || !useAuthStore().isPremium) router.push('/dashboard');
        },
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
