<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/placesStore';
import Navbar from '@/components/atoms/Navbar.vue';
import { onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStringUtils } from '@/utils/strings';
import MoreVoted from './MoreVoted.vue';

const authStore = useAuthStore();
const { truncateDescription } = useStringUtils();
const placesStore = usePlacesStore();
const router = useRouter();

onBeforeMount(async () => {
  await placesStore.loadPlaces();
  isLoggedUser();
});

watch(
  () => authStore.isLoggedIn,
  () => isLoggedUser(),
);

const isLoggedUser = () => {
  if (authStore.isLoggedIn === false) router.push('/login');
}

const goToEdit = (idRestaurant: string) => {
  router.push({ path: `/edit/${idRestaurant}` });
}
</script>

<template>
  <div class="relative md:ml-64 bg-blueGray-100">
    <Navbar :username="authStore.userLogged.username" />
    <!-- Header -->
    <MoreVoted :places="placesStore.places" />
    <div class="px-4 md:px-10 mx-auto w-full -m-8 pb-20 flex flex-wrap items-center">
      <!-- cajas -->
      <div v-for="place in placesStore.places" :key="place._id"
        class="w-full md:w-6/12 sm:w-12/12 lg:w-4/12 px-4 flex relative max-h-[568px] min-h-[568px]">
        <div class="absolute top-2 right-6 z-10 text-black">
          <a class="cursor-pointer" @click.prevent="goToEdit(place._id)">
            <i class="p-4 bg-white rounded-md fas fa-pen-to-square"></i>
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
</template>
