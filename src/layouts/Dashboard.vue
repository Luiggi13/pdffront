<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Navbar from '@/components/atoms/Navbar.vue';
import Sidebar from '@/components/atoms/Sidebar.vue';
import { usePlacesStore } from '@/stores/placesStore';
import type { Restaurants, UpdateVote } from '@/types/restaurants.types';

const authStore = useAuthStore();
const logout = () => authStore.logout();
const placesStore = usePlacesStore();
const router = useRouter();
const alertOpen = ref(false);
const alreadyVotedMessage = ref('')
const down = ref<number>(0);
const idRestaurant = ref<string>("");
const mostRatedPlaces = ref<Restaurants[]>([])
const up = ref<number>(0);


onBeforeMount(async () => {
  await placesStore.loadPlaces();
  firstPlaces();
  isLoggedUser();
});
const isLoggedUser = () => {
  if (authStore.isLoggedIn === false) router.push('/login');
}

const firstPlaces = () => {
  mostRatedPlaces.value = [];
  placesStore.places.forEach((place, i) => {
    if (i < 3) mostRatedPlaces.value.push(place);
  })
}
watch(
  () => authStore.isLoggedIn,
  () => isLoggedUser(),
);

watch(
  () => placesStore.places,
  () => firstPlaces(),
);
const calculateApprovalPercentage = (votesUp: number, users: string[]): number => {
  if (users.length === 0) {
    return 0; // Evitar división por cero
  }

  const totalUsers = users.length;
  const percentage = (votesUp / totalUsers) * 100;

  return percentage;
}
const getBarra = (votesUp: number, users: string[], style = false) => {
  const total = calculateApprovalPercentage(votesUp, users);
  if (style) return `width:${String(total)}%`
  else return `${String(total)}%`
}

const voteUp = (id: string, enabled: boolean) => {
  alreadyVotedMessage.value = '';
  idRestaurant.value = id;

  const r = (placesStore.places.filter(i => i._id === id))
  if (!enabled || r[0].voteOk.includes(authStore.username)) {

    alreadyVotedMessage.value = "No puedes voler a votar 👍"
    openAlert();
    return
  };
  idRestaurant.value = id;
  up.value = 1;
  down.value = 0;
  updateVote({
    idPlace: idRestaurant.value,
    votes: {
      voteDown: down.value,
      voteUp: up.value,
    },
  })
};
const voteDown = (id: string, enabled: boolean) => {
  alreadyVotedMessage.value = '';
  idRestaurant.value = id;
  const r = (placesStore.places.filter(i => i._id === id))
  if (!enabled || r[0].voteKo.includes(authStore.username)) {
    alreadyVotedMessage.value = "No puedes voler a votar 👎"
    openAlert();
    return
  };
  idRestaurant.value = id;
  up.value = 0;
  down.value = 1;
  updateVote({
    idPlace: idRestaurant.value,
    votes: {
      voteDown: down.value,
      voteUp: up.value,
    },
  })
};

// esto en lugar del emit
const updateVote = async (data: { idPlace: string; votes: UpdateVote }) => {
  data.votes.username = authStore.userLogged.username
  const t: { idPlace: string; votes: UpdateVote } = {
    idPlace: data.idPlace,
    votes: {
      voteDown: data.votes.voteDown,
      voteUp: data.votes.voteUp,
      username: authStore.userLogged.username
    }
  }
  await placesStore.patchVote(t)
}

const closeAlert = () => alertOpen.value = false;
const openAlert = () => alertOpen.value = true;
</script>
<template>
  <div class="h-full">
    <Sidebar :username="authStore.username" :is-premium="authStore.userLogged.isPremium" @logout="logout">
      <!-- alert -->
      <div v-if="alertOpen"
        class="text-white px-6 py-4 border-0 rounded absolute mb-4 bg-green-500 z-50 bottom-0 w-52 transition-all">
        <span class="text-xl inline-block mr-5 align-middle">
          <b class="capitalize">{{ authStore.username }}</b>
        </span>
        <span class="inline-block align-middle mr-8 w-full">
          {{ alreadyVotedMessage }}
        </span>
        <button
          class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
          v-on:click="closeAlert()">
          <span><i class="fa-solid fa-xmark"></i></span>
        </button>
      </div>
      <!-- alert -->
    </Sidebar>
    <div class="relative md:ml-64 bg-blueGray-100">
      <Navbar :username="authStore.userLogged.username" />
      <!-- Header -->
      <div class="relative bg-green-600 md:pt-32 pb-32 pt-12">

        <div class="px-4 md:px-10 mx-auto w-full">
          <div class="px-4 md:px-10 mx-auto w-full -m-24">
            <div class="flex flex-wrap mt-20">
              <div class="w-full xl:w-12/12 mb-12 xl:mb-0 px-4">
                <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                  <div class="rounded-t mb-0 px-4 py-3 border-0">
                    <div class="flex flex-wrap items-center">
                      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 class="font-semibold text-base text-blueGray-700">
                          Restaurantes
                        </h3>
                      </div>
                      <!-- <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button
                      class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                      type="button" style="transition:all .15s ease">
                      See all
                    </button>
                  </div> -->
                    </div>
                  </div>
                  <div class="block w-full overflow-x-auto">
                    <!-- Projects table -->
                    <table class="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>
                          <th
                            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Nombre
                          </th>
                          <th
                            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Porcentaje votos a favor
                          </th>
                          <th
                            class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Web
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="place in mostRatedPlaces" :key="place._id">
                          <th
                            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            {{ place.name }}
                          </th>
                          <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div class="flex items-center">
                              <span class="mr-2">{{ getBarra(place.voteUp, place.users) }}</span>
                              <div class="relative w-full">
                                <div class="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                  <div :style="getBarra(place.voteUp, place.users, true)"
                                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500">
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <a v-if="place.web" :href="place.web" target="_blank"
                              class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                              style="transition:all .15s ease">
                              Ver sitio web
                            </a>
                            <a v-if="place.street" :href="place.street" target="_blank"
                              class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                              style="transition:all .15s ease">
                              Google Maps
                            </a>
                            <p v-else> Sin web </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 md:px-10 mx-auto w-full -m-8 pb-20 flex flex-wrap items-center">
        <!-- cajas -->
        <div v-for="place in placesStore.places" :key="place._id"
          class="w-full md:w-6/12 sm:w-12/12 lg:w-4/12 px-4 flex relative">
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
              <p class="text-md font-light mt-2 text-white">{{ place.description }}</p>
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