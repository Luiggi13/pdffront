import axiosInstance from '@/axios';
import { API_ROUTES } from '@/config/apiRoutes';
import type { PostRestaurant, Restaurants, UpdateVote } from '@/types/restaurants.types';

export const usePlaces = () => {
  const getPlaces = async (onlyEnabled = true) => {
    const response = await axiosInstance.get<Restaurants[]>(`${API_ROUTES.places}?enabled=${onlyEnabled}`);

    return response;
  };

  const getPlacesNotDiscarded = async () => {
    const response = await axiosInstance.get<Restaurants[]>(API_ROUTES.discarded);

    return response;
  };

  const patchPlace = async (restaurant: Restaurants) => {
    const response = await axiosInstance.patch<Restaurants>(`${API_ROUTES.places}/${restaurant._id}`, restaurant);

    return response;
  };

  const patchVoteById = async (data: { idPlace: string; votes: UpdateVote }) => {
    const response = await axiosInstance.patch<Restaurants>(`${API_ROUTES.places}/${data.idPlace}/votes`, data.votes);

    return response;
  };
  const patchPlaceVisibilityById = async (data: { idPlace: string; enabled: boolean }) => {
    const response = await axiosInstance.patch<Restaurants>(`${API_ROUTES.visibility}/${data.idPlace}`, {
      enabled: data.enabled,
    });

    return response;
  };

  const patchPlaceDiscardedById = async (data: { idPlace: string; discarded: boolean }) => {
    const response = await axiosInstance.patch<Restaurants>(`${API_ROUTES.discarded}/${data.idPlace}`, {
      discarded: data.discarded,
    });

    return response;
  };

  const deletePlaceById = async (idPlace: string) => {
    const response = await axiosInstance.delete<Restaurants>(`${API_ROUTES.places}/${idPlace}`);

    return response;
  };

  const postRestaurant = async (data: PostRestaurant) => {
    const response = await axiosInstance.post<PostRestaurant>(`${API_ROUTES.places}`, data);

    return response;
  };
  const getRestaurantById = async (restaurant_id: string) => {
    const response = await axiosInstance.get<Restaurants>(`${API_ROUTES.places}/${restaurant_id}`);

    return response;
  };
  return {
    deletePlaceById,
    getPlaces,
    getPlacesNotDiscarded,
    getRestaurantById,
    patchPlace,
    patchPlaceDiscardedById,
    patchPlaceVisibilityById,
    patchVoteById,
    postRestaurant,
  };
};
