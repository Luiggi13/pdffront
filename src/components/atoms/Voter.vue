<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits<{
  (e: 'returnedVotos', votos: number): void;
}>();

const votos = ref(0);
const voteUp = () => {
  votos.value++;
  returnVotes();
};

const voteDown = () => {
  if (votos.value > 0) {
    votos.value--;
    returnVotes();
  }
  return;
};
const isDisabledUp = computed(() => votos.value > 0)
const returnVotes = () => emit('returnedVotos', votos.value);

onBeforeMount(() => {
  if (useAuthStore().isLoggedIn === false) router.push('/')
})
</script>

<template>
  <div class="voter">
    <div class="inline-flex bg-blue-500 p-1 rounded-full">
      <button :disabled="isDisabledUp"
        class="bg-blue-300 hover:bg-blue-200 text-white hover:text-blue-500 font-bold py-2 px-4 rounded-3xl disabled:bg-gray-300"
        @click="voteUp">
        {{ isDisabledUp ? '🚫' : '👍🏻' }}
      </button>
      <span class="text-white font-bold py-2 px-4 rounded-r w-14 text-center">
        {{ votos }}</span>
      <button class="bg-blue-300 hover:bg-blue-200 text-white hover:text-blue-500 font-bold py-2 px-4 rounded-3xl"
        @click="voteDown">
        {{ !isDisabledUp ? '🚫' : '👎🏻' }}
      </button>
    </div>
  </div>
</template>
<style lang="css">
.voter {
  width: 146px;
  height: 46px;
}
</style>
