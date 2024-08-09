<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/atoms/Sidebar.vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const logout = () => authStore.logout();
watch(
  () => authStore.isLoggedIn,
  () => {
    if (useAuthStore().isLoggedIn === false) router.push('/login');
  },
);
</script>
<template>
  <div class="h-full">
    <Sidebar :is-premium="authStore.isPremium" @logout="logout" />
    <router-view></router-view>
  </div>
</template>
