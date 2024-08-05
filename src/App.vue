<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppStore } from './stores/appStore';
import { ref, watch } from 'vue';
const appStore = useAppStore();
const showNotification = ref(appStore.isNotificationVisible);
const hideNotification = () => {
  useAppStore().isNotificationVisible = false;
};
const showNotificationWithDelay = () => {
  setTimeout(() => {
    hideNotification();
  }, 2000);
};

watch(
  () => appStore.isNotificationVisible,
  (n: boolean) => {
    showNotification.value = n
    if (n) {
      showNotificationWithDelay()
    }
  }
);
</script>
<template>
  <div>
    <div v-if="showNotification && !appStore.isNotificationError"
      :class="{ 'fade-enter-notification': showNotification && !appStore.isNotificationError }"
      class="notification rounded-md w-[96%] flex flex-col bg-green-400 text-black text-lg p-4"
      @click="hideNotification">
      <span><i class="fa-solid fa-check"></i> {{ appStore.notificationMessage }}</span>
    </div>
    <div v-else-if="showNotification && appStore.isNotificationError"
      :class="{ 'fade-enter-notification': showNotification && appStore.isNotificationError }"
      class="notification rounded-md w-[96%] flex flex-col bg-red-700 text-white text-lg p-4" @click="hideNotification">

      <span><i class="fa-solid fa-triangle-exclamation"></i> {{ appStore.notificationMessage }}</span>
    </div>
  </div>
  <RouterView />
</template>
<style scoped>
.notification {
  position: fixed;
  bottom: 2%;
  left: 2%;
  z-index: 1;
  transition: all 2.5s ease;
  opacity: 0;
  transform: scale(1);

  i.fa-check {
    background-color: #167837;
    color: transparent;
    padding: 0.3rem;
    border-radius: 50%;
  }
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter {
  transform: scale(5);
}

.fade-enter-notification {
  opacity: 1;
  z-index: 90000;
}
</style>