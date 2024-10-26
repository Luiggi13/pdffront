import axiosInstance from '@/axios';
import { API_ROUTES } from '@/config/apiRoutes';

export const useUpload = () => {
  const uploadFiles = async (formData: FormData) => {
    const response = await axiosInstance.post(API_ROUTES.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };

  return {
    uploadFiles,
  };
};
