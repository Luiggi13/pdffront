<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/atoms/Sidebar.vue';

const authStore = useAuthStore();
const logout = () => authStore.logout();
const alertOpen = ref(false);
const alreadyVotedMessage = ref('')

const closeAlert = () => alertOpen.value = false;
const openAlert = () => alertOpen.value = true;
</script>
<template>
  <div class="h-full">
    <Sidebar :username="authStore.username" :is-premium="authStore.userLogged.isPremium" @logout="logout">
      <!-- alert -->
      <div v-if="alertOpen"
        class="text-white px-6 py-4 border-0 rounded absolute mb-4 bg-green-500 z-50 bottom-0 w-52 transition-all">
        <span class="text-xl inline-block mr-5 align-middle">
          <b class="capitalize">{{ authStore.username }}</b>
        </span>
        <span class="inline-block align-middle mr-8 w-full">
          {{ alreadyVotedMessage }}
        </span>
        <button
          class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
          v-on:click="closeAlert()">
          <span><i class="fa-solid fa-xmark"></i></span>
        </button>
      </div>
      <!-- alert -->
    </Sidebar>
    <router-view></router-view>
  </div>
</template>
