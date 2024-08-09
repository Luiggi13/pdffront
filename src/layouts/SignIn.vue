<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { onBeforeMount } from 'vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isLogged = computed(() => authStore.isLoggedIn);
const userProfile = ref({ username: '', password: '' });
const isEnabled = computed(() => {
  if (userProfile.value.username && userProfile.value.password) return false;
  return true;
})

const navigateToHome = () => router.push('/dashboard');

const loginUsers = async () => {
  await authStore.postLogin(userProfile.value.username, userProfile.value.password);
  if (isLogged) navigateToHome();
}

onBeforeMount(() => {
  if (authStore.isLoggedIn) navigateToHome();
})
const isEnabledPage = computed(() => import.meta.env.VITE_API_ENABLED === 'false')
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img :class="{ 'h-16 hover:h-24': !isEnabledPage, 'animate-pulse': isEnabledPage, }"
        class="mx-auto w-auto rounded-full hover:transition-all transition-all" src="../assets/cbre.png" alt="CBRE" />
      <h2 v-if="!isEnabledPage" class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Iniciar sesión
      </h2>
    </div>

    <div v-if="!isEnabledPage" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Usuario</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" required="true"
              v-model="userProfile.username"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" required="true" v-model="userProfile.password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all disabled:bg-gray-500"
            :disabled="isEnabled" @click="loginUsers">Iniciar sesión</button>
        </div>
      </form>
    </div>
  </div>
</template>