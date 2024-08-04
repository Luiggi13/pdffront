import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { login } from '@/axios/login';
import type { UserProfile, UserProfileResponse } from '@/types/user.types';

export const useAuthStore = defineStore(
  'authStore',
  () => {
    const isLoading = ref(false);
    const emptyUser = {
      username: '',
      name: '',
      expired: false,
      isPremium: false,
      teams: [],
      votes: 0,
      logged: false,
      token: '',
    } as UserProfile;
    const userLogged = ref<UserProfile>({
      username: '',
      name: '',
      expired: false,
      isPremium: false,
      teams: [],
      votes: 0,
      logged: false,
      token: '',
    });
    const isLoggedIn = computed(() => {
      if (userLogged.value.token && userLogged.value.logged) return true;
      return false;
    });
    const username = computed(() => userLogged.value.username);
    const isPremium = computed(() => userLogged.value.isPremium);
    const logout = () => (userLogged.value = emptyUser);
    const postLogin = async (username: string, password: string): Promise<UserProfile> => {
      isLoading.value = true;
      try {
        userLogged.value = await login(username, password);
      } finally {
        isLoading.value = false;
        return userLogged.value;
      }
    };
    const showIcon = ref(false);
    const toggleIcon = () => (showIcon.value = !showIcon.value);
    return {
      isLoggedIn,
      isPremium,
      logout,
      postLogin,
      userLogged,
      username,
      toggleIcon,
    };
  },
  { persist: true }
);
