import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PostRestaurant, Restaurants, UpdateVote } from '@/types/restaurants.types';
import { usePlaces } from '@/composables/usePlaces';

export const usePlacesStore = defineStore(
  'placesStore',
  () => {
    const places = ref<Restaurants[]>([]);
    const allPlaces = ref<Restaurants[]>([]);
    const newPlace = ref<Restaurants>();
    const messageError = ref<string>('');
    const isLoadingPlaces = ref<boolean>(false);
    const isPatchingPlace = ref<boolean>(false);
    const isSaving = ref<boolean>(false);
    const headers: { title: string; width: string }[] = [
      { title: 'Nombre', width: 'w-[300px]' },
      { title: 'Votos 👍', width: 'w-[100px]' },
      { title: 'Usuarios 👍', width: 'w-[300px]' },
      { title: 'Votos 👎', width: 'w-[100px]' },
      { title: 'Usuarios 👎', width: 'w-[300px]' },
    ];
    const {
      getPlaces,
      getPlacesNotDiscarded,
      patchVoteById,
      postRestaurant,
      patchPlaceVisibilityById,
      deletePlaceById,
      patchPlaceDiscardedById,
      patchPlace,
    } = usePlaces();

    const loadPlaces = async (onlyEnabled = true) => {
      try {
        isLoadingPlaces.value = true;
        const resp = await getPlaces(onlyEnabled);
        places.value = resp.data;
        // places.value = resp.data?.filter((place) => place.enabled);
      } catch (error) {
        console.log(error);
      } finally {
        isLoadingPlaces.value = false;
      }
    };

    const loadPlaceNotDiscarded = async () => {
      try {
        isLoadingPlaces.value = true;
        const resp = await getPlacesNotDiscarded();
        places.value = resp.data;
      } catch (error) {
        console.log(error);
      } finally {
        isLoadingPlaces.value = false;
      }
    };

    const loadAllPlaces = async () => {
      try {
        isLoadingPlaces.value = true;
        const resp = await getPlaces();
        allPlaces.value = resp.data;
      } catch (error) {
        console.log(error);
      } finally {
        isLoadingPlaces.value = false;
      }
    };
    const savePlace = async (data: PostRestaurant) => {
      try {
        isSaving.value = true;
        const resp = await postRestaurant(data);
        return (newPlace.value = resp.data as unknown as Restaurants);
      } catch (error) {
        console.log(error);
      } finally {
        isSaving.value = false;
      }
    };
    const patchPlaceById = async (restaurant: Restaurants) => {
      try {
        isPatchingPlace.value = true;
        const respuesta = await patchPlace(restaurant);
        if (respuesta.data.error) {
          errorAVoidDuplicates(respuesta.data.error);
          isPatchingPlace.value = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        await getPlaces(false);
        isPatchingPlace.value = false;
      }
    };
    const patchVote = async (data: { idPlace: string; votes: UpdateVote }) => {
      try {
        isLoadingPlaces.value = true;
        const respuesta = await patchVoteById(data);
        if (respuesta.data.error) {
          errorAVoidDuplicates(respuesta.data.error);
          isLoadingPlaces.value = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        const resp = await getPlaces();
        places.value = resp.data.filter((place) => place.enabled);
        isLoadingPlaces.value = false;
      }
    };
    const patchVisibility = async (data: { idPlace: string; enabled: boolean }) => {
      try {
        isLoadingPlaces.value = true;
        const respuesta = await patchPlaceVisibilityById(data);
        if (respuesta.data.error) {
          errorAVoidDuplicates(respuesta.data.error);
          isLoadingPlaces.value = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        const resp = await getPlaces();
        places.value = resp.data.filter((place) => place.enabled);
        allPlaces.value = resp.data;
        isLoadingPlaces.value = false;
      }
    };
    const patchDiscarded = async (data: { idPlace: string; discarded: boolean }) => {
      try {
        isLoadingPlaces.value = true;
        const respuesta = await patchPlaceDiscardedById(data);
        if (respuesta.data.error) {
          errorAVoidDuplicates(respuesta.data.error);
          isLoadingPlaces.value = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        const resp = await getPlaces();
        places.value = resp.data.filter((place) => place.enabled);
        allPlaces.value = resp.data;
        isLoadingPlaces.value = false;
      }
    };
    const deleteById = async (idPlace: string) => {
      try {
        isLoadingPlaces.value = true;
        const respuesta = await deletePlaceById(idPlace);
        if (respuesta.data.error) {
          errorAVoidDuplicates(respuesta.data.error);
          isLoadingPlaces.value = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        const resp = await getPlaces();
        places.value = resp.data.filter((place) => place.enabled);
        allPlaces.value = resp.data;
        isLoadingPlaces.value = false;
      }
    };
    const errorAVoidDuplicates = (msg: string) => {
      messageError.value = msg;
      setTimeout(() => {
        messageError.value = '';
      }, 5000);
    };
    return {
      allPlaces,
      deleteById,
      headers,
      isLoadingPlaces,
      isPatchingPlace,
      isSaving,
      loadAllPlaces,
      loadPlaces,
      loadPlaceNotDiscarded,
      messageError,
      newPlace,
      patchDiscarded,
      patchPlaceById,
      patchVisibility,
      patchVote,
      places,
      savePlace,
    };
  },
  { persist: true }
);
