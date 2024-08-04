import { API_ROUTES } from '@/config/apiRoutes';
import axiosInstance from '@/axios';
import type { UserProfile, UserProfileResponse } from '@/types/user.types';
export const login = async (username: string, password: string): Promise<UserProfile> => {
  const response = await axiosInstance.post<UserProfileResponse>(API_ROUTES.login, {
    username,
    password,
  });
  const userProfile = userResponseToUserProfile(response.data);
  return userProfile;
};

const userResponseToUserProfile = (response: UserProfileResponse) => {
  return {
    username: response.user.username,
    name: response.user.name,
    expired: false,
    isPremium: response.user.isPremium,
    teams: response.user.teams,
    votes: response.user.votes,
    logged: response.logged,
    token: response.token,
  } as UserProfile;
};
