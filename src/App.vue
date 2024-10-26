<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppStore } from './stores/appStore';
import { ref, watch } from 'vue';
const appStore = useAppStore();
</script>
<template>
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
    color: #4aed80;
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