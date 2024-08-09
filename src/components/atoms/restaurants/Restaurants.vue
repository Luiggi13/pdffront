<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/placesStore';
import Navbar from '@/components/atoms/Navbar.vue';
import type { DeleteRestaurant } from '@/types/restaurants.types';
import TableRestaurants from './TableRestaurants.vue';
import ModalDeleteRestaurant from '@/components/atoms/modals/ModalDeleteRestaurant.vue';
import { useRouter } from 'vue-router';

const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const placesStore = usePlacesStore();
const statusModal = ref<boolean>(false);
const placeToDelete = ref<DeleteRestaurant>({
  _id: '',
  name: '',
});

onBeforeMount(async () => {
  await placesStore.loadPlaceNotDiscarded();
});

const mensaje = (message: string, isError: boolean) => appStore.setNotifyMessage(message, isError);

const checkIfPlaceExist = async () => {
  const encontrado = await placesStore.restaurantById(placeToDelete.value._id);
  if (!encontrado?.data._id) {
    mensaje(`Restaurante "${encontrado?.data.name} no existe"`, true)
    return statusModal.value = !statusModal.value;
  };
}

const submit = async () => {
  checkIfPlaceExist();
  await placesStore.deleteById(placeToDelete.value._id)
  mensaje(`Restaurante ${placeToDelete.value.name} ha sido eliminado correctamente`, false);
  return statusModal.value = !statusModal.value;
}

const deletePlace = (restaurant: DeleteRestaurant) => {
  statusModal.value = true;
  placeToDelete.value = restaurant;
}
const closeModal = (close: boolean) => {
  statusModal.value = !close;
}

const editPlace = (placeId: string) => {
  router.push({ path: `/edit/${placeId}` });
}
</script>

<template>
  <div class="relative md:ml-64 bg-blueGray-100">
    <Navbar :username="authStore.userLogged.username" />
    <div class="relative bg-white pt-12">
      <div class="px-4 md:px-10 mx-auto w-full">
        <div class="px-4 md:px-10 mx-auto w-full">
          <div class="flex flex-wrap mt-5">
            <div class="w-full xl:w-12/12 px-4">
              <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
                <div class="rounded-t mb-0 py-3 border-0">
                  <h3 class="font-semibold text-base text-blueGray-700 w-full border-b-[1px] pb-2">
                    Listado de restaurantes
                  </h3>
                </div>
                <div class="w-full overflow-x-auto">
                  <TableRestaurants :places="placesStore.places" @delete-restaurant="deletePlace"
                    @edit-restaurant="editPlace" />
                  <ModalDeleteRestaurant :is-visible="statusModal" :place="placeToDelete" @delete-restaurant="submit"
                    @close="closeModal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
