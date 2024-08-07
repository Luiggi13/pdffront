<script lang="ts" setup>
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/placesStore';
import { useRoute, useRouter } from 'vue-router';
import Loading from '@/components/atoms/LoadingAtom.vue';
import Navbar from '@/components/atoms/Navbar.vue';
import type { Restaurants } from '@/types/restaurants.types';
import TableRestaurants from './TableRestaurants.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const placesStore = usePlacesStore();
const restaurantToEdit = ref<Restaurants>()

onBeforeMount(async () => {
  authStore.isPremium ? await placesStore.loadPlaces() : await placesStore.loadPlaceNotDiscarded();
});


const mensaje = (message: string, isError: boolean) => appStore.setNotifyMessage(message, isError);

const formValue = reactive<Restaurants>({
  _id: "",
  username: "",
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
  return (hasLength(formValue.name) && hasLength(formValue.street))
}

const resetForm = () => {
  formValue._id = "";
  formValue.username = "";
  formValue.name = "";
  formValue.street = "";
  formValue.gmaps = "";
  formValue.image = "";
  formValue.web = "";
  formValue.voteUp = 0;
  formValue.voteDown = 0;
  formValue.users = [];
  formValue.voteKo = [];
  formValue.voteOk = [];
  formValue.enabled = true;
  formValue.discarded = false;
  formValue.description = '';
}

const hasLength = (data: string) => {
  return data.length > 0
}

const submit = async () => {
  if (!isSubmitEnabled()) return;
  const index = placesStore.places.findIndex((item) => item.name.toLocaleLowerCase() === formValue.name.toLocaleLowerCase());
  if (index !== -1) placesStore.places.splice(index, 1);

  const exist = placesStore.places.find((restaurant) => restaurant.name.toLocaleLowerCase() === formValue.name.toLocaleLowerCase());
  if (exist?._id) return mensaje(`Restaurante "${formValue.name} ya existe"`, true);

  await placesStore.patchPlaceById(formValue);
  mensaje(`Restaurante "${formValue.name} ha sido actualizado correctamente"`, false);
  resetForm();
}

const fillRestaurant = () => {
  if (!restaurantToEdit.value) return;

  Object.assign(formValue, {
    ...restaurantToEdit.value,
    username: useAuthStore().userLogged.username,
    _id: restaurantToEdit.value._id ?? '',
    name: restaurantToEdit.value.name ?? '',
    street: restaurantToEdit.value.street ?? '',
    gmaps: restaurantToEdit.value.gmaps ?? '',
    image: restaurantToEdit.value.image ?? '',
    web: restaurantToEdit.value.web ?? '',
    enabled: restaurantToEdit.value.enabled ?? false,
    description: restaurantToEdit.value.description ?? '',
    voteUp: restaurantToEdit.value.voteUp ?? 0,
    voteDown: restaurantToEdit.value.voteDown ?? 0,
    users: restaurantToEdit.value.users ?? [],
    voteKo: restaurantToEdit.value.voteKo ?? [],
    voteOk: restaurantToEdit.value.voteOk ?? [],
    discarded: restaurantToEdit.value.discarded ?? false,
  });
};


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
                    Eliminar restaurante
                  </h3>
                </div>
                <div class="w-full overflow-x-auto">

                  <TableRestaurants :places="placesStore.places" />


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
