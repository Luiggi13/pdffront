<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Navbar from '@/components/atoms/Navbar.vue';
import Sidebar from '@/components/atoms/Sidebar.vue';
import { usePlacesStore } from '@/stores/placesStore';
import type { UpdateVote } from '@/types/restaurants.types';
import MoreVoted from '@/components/atoms/restaurants/MoreVoted.vue';
import { useAppStore } from '@/stores/appStore';
import { useStringUtils } from '@/utils/strings';
import { useRouter } from 'vue-router';
const { truncateDescription } = useStringUtils();
const authStore = useAuthStore();
const placesStore = usePlacesStore();
const appStore = useAppStore();
const router = useRouter();
const logout = () => authStore.logout();
const up = ref<number>(0);
const down = ref<number>(0);

onBeforeMount(async () => {
  authStore.isPremium ? await placesStore.loadPlaces() : await placesStore.loadPlaceNotDiscarded();
});

const voteUp = (id: string, enabled: boolean) => {
  const filteredRestaurants = (placesStore.places.find(i => i._id === id));
  if (!enabled || filteredRestaurants?.voteOk.includes(authStore.username)) {
    return mensaje(`No puedes voler a votar 👍`, true);
  };
  up.value = 1;
  down.value = 0;
  updateVote({
    idPlace: id,
    votes: {
      voteDown: down.value,
      voteUp: up.value,
    },
  })
};
const voteDown = (id: string, enabled: boolean) => {
  const filteredRestaurants = (placesStore.places.find(i => i._id === id))
  if (!enabled || filteredRestaurants?.voteKo.includes(authStore.username)) {
    return mensaje(`Restaurante "No puedes voler a votar 👎`, true);
  };
  up.value = 0;
  down.value = 1;
  updateVote({
    idPlace: id,
    votes: {
      voteDown: down.value,
      voteUp: up.value,
    },
  })
};

const updateVote = async (data: { idPlace: string; votes: UpdateVote }) => {
  data.votes.username = authStore.userLogged.username
  const dataToUpdate: { idPlace: string; votes: UpdateVote } = {
    idPlace: data.idPlace,
    votes: {
      voteDown: data.votes.voteDown,
      voteUp: data.votes.voteUp,
      username: data.votes.username,
    }
  }
  await placesStore.patchVote(dataToUpdate);
  authStore.isPremium ? await placesStore.loadPlaces() : await placesStore.loadPlaceNotDiscarded();
};
const mensaje = (message: string, isError: boolean) => appStore.setNotifyMessage(message, isError);

watch(
  () => authStore.isLoggedIn,
  () => {
    if (useAuthStore().isLoggedIn === false) router.push('/login');
  },
);
</script>
<template>
  <div class="h-full">
    <Sidebar :is-premium="authStore.isPremium" @logout="logout" />
    <div class="relative md:ml-64 bg-blueGray-100">
      <Navbar :username="authStore.userLogged.username" />
      <MoreVoted :places="placesStore.places" />
      <div class="px-4 md:px-10 mx-auto w-full -m-8 pb-20 flex flex-wrap items-center">
        <!-- cajas -->
        <div v-for="place in placesStore.places" :key="place._id"
          class="w-full md:w-6/12 sm:w-12/12 lg:w-4/12 px-4 flex relative min-h-[568px]">
          <div class="absolute top-5 right-6 z-10 text-black">
            <a class="cursor-pointer" title="Voto a favor" @click.prevent="voteUp(place._id, place.enabled)">
              <span class="p-4 bg-white rounded-md text-green-700 font-bold">👍🏻 {{ place.voteUp
                }}</span>
            </a>
            <a class="cursor-pointer" title="Voto en contra" @click.prevent="voteDown(place._id, place.enabled)">
              <span class="p-4 bg-white rounded-md ml-2 text-red-700 font-bold">👎🏻 {{ place.voteDown
                }}</span>
            </a>
          </div>
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-green-600">
            <img :alt="place.name" :src="place.image" class="w-full align-middle rounded-t-lg" />
            <blockquote class="relative p-8 mb-4 h-[320px]">
              <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 583 95"
                class="absolute left-0 w-full block" style="height: 95px; top: -94px">
                <polygon points="-30,95 583,95 583,65" class="text-green-600 fill-current"></polygon>
              </svg>
              <h4 class="text-xl font-bold text-white">{{ place.name }}</h4>
              <p class="text-md font-light mt-2 text-white">{{ truncateDescription(place.description, 170) }}</p>
            </blockquote>
            <div class="flex flex-wrap items-center mx-auto mb-4">
              <a v-if="place.web" :href="place.web" target="_blank"
                class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                style="transition:all .15s ease">
                Web
              </a>
              <a v-if="place.street" :href="place.street" target="_blank"
                class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                style="transition:all .15s ease">
                Google Maps
              </a>
            </div>
          </div>
        </div>
        <!-- cajas -->
      </div>
    </div>
  </div>
</template>