import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SignIn from '@/layouts/SignIn.vue';
import Dashboard from '@/layouts/Dashboard.vue';
import RestaurantLayout from '@/layouts/RestaurantLayout.vue';
import Restaurants from '@/components/atoms/restaurants/Restaurants.vue';
import AddRestaurants from '@/components/atoms/restaurants/AddRestaurants.vue';
import EditRestaurants from '@/components/atoms/restaurants/EditRestaurants.vue';
import { useAuthStore } from '@/stores/authStore';
import Upload2 from '@/layouts/Upload2.vue';

export const menusApp: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      return { path: '/upload' };
    },
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload2,
    meta: {
      title: 'Upload',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: SignIn,
    meta: {
      title: 'Christmas Dinner 2024 🎁',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      title: 'Christmas Dinner 2024 - Dashboard',
    },
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
        component: Restaurants,
        meta: {
          title: 'Christmas Dinner 2024 - Restaurantes',
        },
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false) router.push('/login');
          if (useAuthStore().isPremium === false) router.push('/dashboard');
        },
      },
      {
        path: '/add',
        name: 'add-restaurant',
        component: AddRestaurants,
        meta: {
          title: 'Christmas Dinner 2024 - Nuevo restaurante',
        },
        beforeEnter: () => {
          if (useAuthStore().isLoggedIn === false) router.push('/login');
        },
      },
      {
        path: '/edit/:id',
        name: 'edit-restaurant-single',
        component: EditRestaurants,
        meta: {
          title: 'Christmas Dinner 2024 - Editar restaurante',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../layouts/Dashboard.vue'),
    beforeEnter: () => (window.location.pathname = import.meta.env.BASE_URL),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: menusApp,
});
router.beforeEach((to, from) => {
  document.title = String(to.meta.title) ?? 'Christmas Dinner 2024 🎁';
});

export default router;
