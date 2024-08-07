<script setup lang="ts">
import { usePlacesStore } from '@/stores/placesStore';
import type { Restaurants } from '@/types/restaurants.types';
import { onBeforeMount, ref } from 'vue';

const seAll = ref<boolean>(false);
const mostRatedPlaces = ref<Restaurants[]>([])

const placesStore = usePlacesStore();
onBeforeMount(async () => {
  await placesStore.loadPlaces();
  firstPlaces();
});

const firstPlaces = (all = false) => {
  mostRatedPlaces.value = [];
  if (all) {
    seAll.value = true;
    return mostRatedPlaces.value = placesStore.places;
  }
  seAll.value = false;
  placesStore.places.forEach((place, i) => {
    if (i < 3) mostRatedPlaces.value.push(place);
  })
}

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
</script>
<template>
  <div class="relative bg-green-600 md:pt-32 pb-32 pt-12">

    <div class="px-4 md:px-10 mx-auto w-full">
      <div class="px-4 md:px-10 mx-auto w-full -m-24">
        <div class="flex flex-wrap mt-20">
          <div class="w-full xl:w-12/12 mb-12 xl:mb-0 px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div class="rounded-t mb-0 px-4 py-3 border-0">
                <div class="flex flex-wrap items-center">
                  <div class="relative w-full px-2 max-w-full flex-grow flex-1">
                    <h3 class="font-semibold text-base text-blueGray-700">
                      Top 3 restaurantes más votados
                    </h3>
                  </div>
                  <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button v-if="!seAll"
                      class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                      type="button" style="transition:all .15s ease" @click.prevent="firstPlaces(true)">
                      Ver todos
                    </button>
                    <button v-else
                      class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
                      type="button" style="transition:all .15s ease" @click.prevent="firstPlaces()">
                      Ver 3 mejores
                    </button>
                  </div>
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
</template>