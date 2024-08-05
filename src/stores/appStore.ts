import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore(
  'appStore',
  () => {
    const notificationMessage = ref('');
    const isNotificationVisible = ref(false);
    const isNotificationError = ref(false);
    const setNotifyMessage = (message: string, isError: boolean) => {
      isNotificationVisible.value = true;
      isNotificationError.value = isError;
      notificationMessage.value = message;
    };
    return {
      notificationMessage,
      isNotificationVisible,
      setNotifyMessage,
      isNotificationError,
    };
  },
  { persist: true }
);
