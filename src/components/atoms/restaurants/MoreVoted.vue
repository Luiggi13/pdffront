<script setup lang="ts">
import type { Restaurants } from '@/types/restaurants.types';
import { onBeforeMount, ref, watch } from 'vue';

const props = defineProps<{
  places: Restaurants[];
}>();

const seAll = ref<boolean>(false);
const mostRatedPlaces = ref<Restaurants[]>([])

onBeforeMount(async () => {
  firstPlaces();
});

const firstPlaces = (all = false) => {
  mostRatedPlaces.value = [];
  if (all) {
    seAll.value = true;
    return mostRatedPlaces.value = props.places;
  }
  seAll.value = false;
  props.places.forEach((place, i) => {
    if (i < 3) mostRatedPlaces.value.push(place);
  })
}

const calculateApprovalPercentage = (votesUp: number, users: string[]): number => {
  if (users.length === 0) {
    return 0; // Evitar división por cero
  }

  const totalUsers = users.length;
  const percentage = (votesUp / totalUsers) * 100;

  return parseFloat(percentage.toFixed(2));
}
const getBarra = (votesUp: number, users: string[], style = false) => {
  const total = calculateApprovalPercentage(votesUp, users);
  if (style) return `width:${String(total)}%`
  else return `${String(total)}%`
}

watch(
  () => props.places,
  () => {
    firstPlaces();
  }
);
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
                      {{ !seAll ? 'Top 3 restaurantes más votados' : 'Todos los restaurantes' }}
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
                        Porcentaje de votos a favor
                      </th>
                      <th
                        class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Votos a favor
                      </th>
                      <th
                        class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Votos en contra
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
                        <template v-if="place.voteOk.length">
                          <span v-for="(user, i) in place.voteOk" :key="`${user}_${i}`" :title="user"
                            class="inline-flex items-center justify-center w-3 h-3 p-3 ms-1 text-sm font-medium text-white bg-green-500 rounded-full cursor-default">
                            {{ user.substring(0, 2) }}
                          </span>
                        </template>
                        <p v-else> Sin votos a favor </p>
                      </td>
                      <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <template v-if="place.voteKo.length">
                          <span v-for="(user, i) in place.voteKo" :key="`${i}_${user}`" :title="user"
                            class="inline-flex items-center justify-center w-3 h-3 p-3 ms-1 text-sm font-medium text-white bg-green-500 rounded-full cursor-default">
                            {{ user.substring(0, 2) }}
                          </span>
                        </template>
                        <p v-else> Sin votos en contra</p>
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