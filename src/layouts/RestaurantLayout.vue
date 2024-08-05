<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/atoms/Sidebar.vue';

const authStore = useAuthStore();
const logout = () => authStore.logout();
</script>
<template>
  <div class="h-full">
    <Sidebar :username="authStore.username" :is-premium="authStore.userLogged.isPremium" @logout="logout" />
    <router-view></router-view>
  </div>
</template>
