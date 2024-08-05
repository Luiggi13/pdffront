<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/placesStore';
import Navbar from '@/components/atoms/Navbar.vue';
import Loading from '@/components/atoms/LoadingAtom.vue';
import type { PostRestaurant, Restaurants } from '@/types/restaurants.types';
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const authStore = useAuthStore();
const appStore = useAppStore();
const usePlaceStore = usePlacesStore();
const mostRatedPlaces = ref<Restaurants[]>([])
const router = useRouter();

const getBarra = (votesUp: number, users: string[], style = false) => {
  const total = calculateApprovalPercentage(votesUp, users);
  if (style) return `width:${String(total)}%`
  else return `${String(total)}%`
}

const calculateApprovalPercentage = (votesUp: number, users: string[]): number => {
  if (users.length === 0) {
    return 0; // Evitar división por cero
  }

  const totalUsers = users.length;
  const percentage = (votesUp / totalUsers) * 100;

  return percentage;
}

onBeforeMount(async () => {
  await usePlaceStore.loadPlaces();
  firstPlaces();
  isLoggedUser();
});

const firstPlaces = () => {
  mostRatedPlaces.value = [];
  usePlaceStore.places.forEach((place, i) => {
    if (i < 3) mostRatedPlaces.value.push(place);
  })
}
watch(
  () => authStore.isLoggedIn,
  () => isLoggedUser(),
);

watch(
  () => usePlaceStore.places,
  () => {
    firstPlaces()
  },
);
const isLoggedUser = () => {
  if (authStore.isLoggedIn === false) router.push('/login');
}
const mensaje = (message: string, isError: boolean) => appStore.setNotifyMessage(message, isError);

const formValue = ref<PostRestaurant>({
  name: "",
  street: "",
  gmaps: "",
  image: "",
  web: "",
  voteUp: 0,
  voteDown: 0,
  users: [],
  voteKo: [],
  voteOk: [],
  enabled: true,
  discarded: false,
  description: '',
});

const isSubmitEnabled = () => {
  return (hasLength(formValue.value.name) && hasLength(formValue.value.street))
}

const resetForm = () => {
  formValue.value = {
    name: "",
    street: "",
    gmaps: "",
    image: "",
    web: "",
    voteUp: 0,
    voteDown: 0,
    users: [],
    voteKo: [],
    voteOk: [],
    enabled: true,
    discarded: false,
    description: '',
  };
}

const hasLength = (data: string) => {
  return data.length > 0
}

const submit = async () => {
  if (!isSubmitEnabled()) return;
  const exist = usePlaceStore.places.find((restaurant) => restaurant.name.toLocaleLowerCase().includes(formValue.value.name.toLocaleLowerCase()));
  if (exist?._id) return mensaje(`Restaurante "${formValue.value.name} ya existe"`, true);

  await usePlaceStore.savePlace(formValue.value);
  mensaje(`Restaurante "${formValue.value.name} ha sido creado correctamente"`, false);
  resetForm();
  await usePlacesStore().loadPlaces();
}
</script>

<template>
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
                    <div class="relative w-full px-2 max-w-full flex-grow flex-1">
                      <h3 class="font-semibold text-base text-blueGray-700">
                        Restaurantes más votados
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="block w-full overflow-x-auto">
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
      <div class="grid grid-cols-2 mx-auto w-6/12 mb-5">
        <div class="bg-white border rounded-lg shadow border-gray-700 relative p-5">
          <form class="space-y-4 md:space-y-6">
            <div>
              <label for="name" class="text-blueGray-600 block mb-2 text-sm font-medium">Nombre</label>
              <input v-model="formValue.name" type="text" name="name" id="name"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Restaurante Oasis" required>
            </div>
            <div>
              <label for="street"
                class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Dirección</label>
              <input v-model="formValue.street" type="text" name="street" id="street"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Carrer de Roselló 255" autocomplete="off" required>
            </div>
            <div>
              <label for="gmaps" class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Google
                Maps</label>
              <input v-model="formValue.gmaps" type="text" name="gmaps" id="gmaps"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                autocomplete="off" required>
            </div>
            <div>
              <label for="image" class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Imágen</label>
              <input v-model="formValue.image" type="text" name="image" id="image"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80"
                autocomplete="off">
            </div>
            <div>
              <label for="web" class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Website</label>
              <input v-model="formValue.web" type="text" name="web" id="web" placeholder="https://www.google.es"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                autocomplete="off">
            </div>
            <div>
              <label for="description"
                class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Website</label>
              <textarea v-model="formValue.description" type="text" name="description" id="description"
                placeholder="Es ist ein lang erwiesener Fakt, dass ein Leser vom Text abgelenkt wird, wenn er sich ein Layout ansieht. Der Punkt, Lorem Ipsum zu nutzen."
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                autocomplete="off" rows="15"></textarea>
            </div>
            <div>
              <label for="enabled" class="mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Activar
                restaurante</label>
              <input v-model="formValue.enabled" type="checkbox" name="enabled" id="enabled"
                placeholder="https://www.google.es"
                class="bg-gray-50 border border-gray-300 text-gray-400 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-blueGray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                autocomplete="off" required>
            </div>
            <button v-if="!usePlaceStore.isSaving" @click.prevent="submit"
              :class="{ 'bg-[#ccc] hover:bg-[#ccc] focus:ring-[#ccc] cursor-not-allowed focus:outline-none disabled:opacity-75': !isSubmitEnabled() }"
              class="w-full text-white bg-[#19690b] hover:bg-[#37762c] focus:ring-4 focus:outline-none focus:ring-[#19690b] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#19690b] dark:hover:bg-[#19690b] dark:focus:ring-[#19690b]"
              :disabled="!isSubmitEnabled()">Crear restaurante</button>
            <div v-else class="flex justify-center">
              <Loading :is-loading="usePlaceStore.isSaving" />
            </div>
          </form>
        </div>
      </div>
      <!-- cajas -->
    </div>
  </div>
</template>
