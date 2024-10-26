<template>
    <div>
      <input type="file" accept=".pdf" @change="handleFileChange" />
      <button @click="uploadFile" :disabled="!selectedFile">Upload PDF</button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import axios, { type AxiosResponse } from 'axios';
import { API_ROUTES } from '@/config/apiRoutes';
  
  // Definimos el estado local para guardar el archivo seleccionado
  const selectedFile = ref<File | null>(null);
  
  const handleFileChange = (event: Event) => {
    // Verificamos si hay un archivo seleccionado
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
  
    // Validamos que el archivo sea PDF
    if (file && file.type === "application/pdf") {
      selectedFile.value = file;
    } else {
      // Limpiamos la selección si el archivo no es un PDF
      selectedFile.value = null;
      alert("Please select a valid PDF file.");
    }
  };
  
  const uploadFile = async () => {
    // Verificamos que haya un archivo seleccionado
    if (!selectedFile.value) return;
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile.value);
  
      // Realizamos la solicitud POST
      const response: AxiosResponse = await axios.post(API_ROUTES.upload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log(response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload the file.");
    }
  };
  </script>
  