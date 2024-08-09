<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  text?: string;
}>();

const loadingText = computed(() => props.text ?? 'Cargando...')
</script>
<template>
  <div v-if="props.isVisible" class="overlay">
    <div class="overlay-blur"></div>
    <div class="overlay__inner">
      <div class="overlay__content">
        <span class="spinner"></span>
        <span class="text-white"> {{ loadingText }} </span>
      </div>
    </div>
  </div>
</template>
<style lang="css">
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 1000;
}

.overlay-blur {
  filter: blur(1px);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #222222c2;
  z-index: 1;
}

.overlay__inner {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay__content {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  /* Coloca los elementos en columna */
  align-items: center;
  /* Centra los elementos horizontalmente */
}

.spinner {
  width: 75px;
  height: 75px;
  display: inline-block;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.05);
  border-top-color: #fff;
  animation: spin 1s infinite linear;
  border-radius: 100%;
  border-style: solid;
  margin-bottom: 10px;
  /* Añade espacio entre el spinner y el texto */
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>