import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUsers } from '@/composables/useUsers';
import type { GenericUser } from '@/types/user.types';

export const useUserStore = defineStore(
  'userStore',
  () => {
    const users = ref<GenericUser[]>([]);
    const isLoadingUsers = ref<boolean>(false);

    const { getAllUsers } = useUsers();

    const loadUsers = async () => {
      try {
        isLoadingUsers.value = true;
        const resp = await getAllUsers();
        users.value = resp.data;
      } catch (error) {
        console.log(error);
      } finally {
        isLoadingUsers.value = false;
      }
    };

    return {
      isLoadingUsers,
      loadUsers,
      users,
    };
  },
  { persist: true }
);
