<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppStore } from './stores/appStore';
const appStore = useAppStore();
</script>
<template>
  <RouterView />
</template>