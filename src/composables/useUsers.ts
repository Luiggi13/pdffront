import axiosInstance from '@/axios';
import { API_ROUTES } from '@/config/apiRoutes';
import type { GenericUser } from '@/types/user.types';

export const useUsers = () => {
  const getAllUsers = async () => {
    const response = await axiosInstance.get<GenericUser[]>(API_ROUTES.users);

    return response;
  };

  return {
    getAllUsers,
  };
};
