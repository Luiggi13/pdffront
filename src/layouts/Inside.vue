<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import Voter from '@/components/atoms/Voter.vue';
import { useRouter } from 'vue-router';
import { onBeforeMount } from 'vue';
const router = useRouter();
const authStore = useAuthStore();
const navigateToLogin = () => router.push('/login');
onBeforeMount(() => {
  if (!authStore.isLoggedIn) navigateToLogin();
})
const setVotes = (emittedVotes: number) => authStore.userLogged.votes = emittedVotes;
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <Voter @returned-votos="setVotes" />
    </div>
  </div>
</template>