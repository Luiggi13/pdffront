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

onBeforeMount(async () => {
  await usePlaceStore.loadPlaces();
  isLoggedUser();
});

watch(
  () => authStore.isLoggedIn,
  () => isLoggedUser(),
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
  username: useAuthStore().userLogged.username,
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
const goToEdit = (idRestaurant: string) => {
  router.push({ path: `/edit/${idRestaurant}` });
}
</script>

<template>
  <div class="relative md:ml-64 bg-blueGray-100">
    <Navbar :username="authStore.userLogged.username" />
    <!-- Header -->
    <div class="relative bg-white pt-12">
      <div class="px-4 md:px-10 mx-auto w-full">
        <div class="px-4 md:px-10 mx-auto w-full">
          <div class="flex flex-wrap mt-5">
            <div class="w-full xl:w-12/12 px-4">
              <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
                <div class="rounded-t mb-0 py-3 border-0">
                  <h3 class="font-semibold text-base text-blueGray-700 w-full border-b-[1px] pb-2">
                    Nuevo restaurante:
                  </h3>
                </div>
                <div class="w-full overflow-x-auto">
                  <div class="mt-4 mx-auto w-full pb-20 flex flex-wrap items-center">
                    <!-- cajas -->
                    <div class="flex flex-wrap mx-auto w-full mb-5">
                      <form class="w-full">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label for="name" class="text-blueGray-600 block mb-2 text-sm font-medium">Nombre <span
                                class="text-sm text-red-600">*</span></label>
                            <input v-model="formValue.name" type="text" name="name" id="name"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Restaurante Oasis" autocomplete="off" required>
                          </div>
                          <div>
                            <label for="street"
                              class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Dirección <span
                                class="text-sm text-red-600">*</span></label>
                            <input v-model="formValue.street" type="text" name="street" id="street"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="Carrer de Roselló 255" autocomplete="off" required>
                          </div>
                          <div>
                            <label for="gmaps"
                              class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Google
                              Maps</label>
                            <input v-model="formValue.gmaps" type="text" name="gmaps" id="gmaps"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              autocomplete="off">
                          </div>
                          <div>
                            <label for="image"
                              class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Imágen</label>
                            <input v-model="formValue.image" type="text" name="image" id="image"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              placeholder="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80"
                              autocomplete="off">
                          </div>
                          <div>
                            <label for="web"
                              class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Website</label>
                            <input v-model="formValue.web" type="text" name="web" id="web"
                              placeholder="https://www.google.es"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                              autocomplete="off">
                          </div>
                        </div>
                        <div>
                          <label for="description"
                            class="block mb-2 text-sm font-medium text-gray-900 text-blueGray-600">Descripción</label>
                          <textarea v-model="formValue.description" type="text" name="description" id="description"
                            placeholder="Es ist ein lang erwiesener Fakt, dass ein Leser vom Text abgelenkt wird, wenn er sich ein Layout ansieht. Der Punkt, Lorem Ipsum zu nutzen."
                            class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none"
                            autocomplete="off" rows="15"></textarea>
                        </div>
                        <div class="my-4">
                          <label for="enabled" class="mb-2 text-sm font-medium text-gray-900 text-blueGray-600">
                            Activar restaurante
                            <input v-model="formValue.enabled" type="checkbox" name="enabled" id="enabled"
                              placeholder="https://www.google.es"
                              class="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5"
                              autocomplete="off">
                          </label>
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
                    <!-- cajas -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
