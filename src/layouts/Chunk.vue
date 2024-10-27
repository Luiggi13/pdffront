<template>
<input type="file" id="file-upload" @change="handleFileUpload">
<p v-if="link">{{ link }}</p>
</template>

<script lang="ts" setup>
import axiosInstance from '@/axios';
import { API_ROUTES } from '@/config/apiRoutes';
import { ref } from 'vue';

const link = ref<string>()
const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  }).then((e:any)=> String(e).split("base64,")[1]);

const handleFileUpload = async (event:any) => {
    const file = event.target.files[0] as File;
    const b64File = await toBase64(file)
    uploadChunk(splitBase64String(b64File), file.name).then((e)=>link.value = e)
}


const uploadChunk = async (file: string[], filename: string, retries = 3): Promise<string> => {
    // console.log(chunk)
    const response = await axiosInstance.post<{message: string, file: string}>(API_ROUTES.uploadServer, {
        file: file,
        filename: filename
    })
    return response.data.file
}

const splitBase64String = (input: string, chunkSize: number = 1024): string[] => {
  // Crear un array vacío para almacenar los chunks
  const chunks: string[] = [];

  // Iterar sobre el string en bloques de tamaño chunkSize
  for (let i = 0; i < input.length; i += chunkSize) {
    // Extraer un chunk del string y agregarlo al array
    chunks.push(input.slice(i, i + chunkSize));
  }

  return chunks
}
</script>