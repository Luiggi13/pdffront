import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PostRestaurant, Restaurants, UpdateVote } from '@/types/restaurants.types';
import { usePlaces } from '@/composables/usePlaces';
import { useAppStore } from './appStore';

export const usePlacesStore = defineStore(
  'placesStore',
  () => {
    const appStore = useAppStore();
    const places = ref<Restaurants[]>([]);
    const allPlaces = ref<Restaurants[]>([]);
    const newPlace = ref<Restaurants>();
    const isLoadingPlaces = ref<boolean>(false);
    const isPatchingPlace = ref<boolean>(false);
    const isSaving = ref<boolean>(false);
    const isDeleting = ref<boolean>(false);
    const {
      getPlaces,
      getRestaurantById,
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
          appStore.setNotifyMessage(respuesta.data.error, true);
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
          appStore.setNotifyMessage(respuesta.data.error, true);
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
          appStore.setNotifyMessage(respuesta.data.error, true);
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
          appStore.setNotifyMessage(respuesta.data.error, true);
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
        isDeleting.value = true;
        const respuesta = await deletePlaceById(idPlace);
        if (respuesta.data.error) {
          isDeleting.value = false;
          isLoadingPlaces.value = false;
          appStore.setNotifyMessage(respuesta.data.error, true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        isDeleting.value = false;
        isLoadingPlaces.value = true;
        const resp = await getPlaces();
        places.value = resp.data.filter((place) => place.enabled);
        allPlaces.value = resp.data;
        isLoadingPlaces.value = false;
      }
    };
    const restaurantById = async (idPlace: string) => {
      try {
        isLoadingPlaces.value = true;
        const respuesta = await getRestaurantById(idPlace);
        if (respuesta.data.error) {
          appStore.setNotifyMessage(respuesta.data.error, true);
          isLoadingPlaces.value = false;
        }
        return respuesta;
      } catch (error) {
        console.log(error);
      } finally {
        isLoadingPlaces.value = false;
      }
    };

    return {
      allPlaces,
      deleteById,
      isLoadingPlaces,
      isPatchingPlace,
      isSaving,
      isDeleting,
      loadAllPlaces,
      loadPlaces,
      loadPlaceNotDiscarded,
      newPlace,
      patchDiscarded,
      patchPlaceById,
      patchVisibility,
      patchVote,
      places,
      restaurantById,
      savePlace,
    };
  },
  { persist: true }
);
