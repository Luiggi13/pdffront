import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Upload2 from '@/layouts/Upload2.vue';

export const menusApp: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/Upload2.vue')
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
