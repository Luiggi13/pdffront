<template>
  <div class="flex flex-col gap-4 h-full justify-center items-center p-20 pnone">
    <img v-if="!isLoading" class="rounded-full mb-4" src="../assets/cbre-apple.png" />
    <div v-if="!isLoading" @dragleave="() => isHover = false" @dragover="() => isHover = true"
      :class="{ 'bg-green-50': isHover }"
      class="flex flex-col items-center justify-center w-full min-h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:focus:bg-gray-800 dark:bg-gray-700 focus:bg-gray-100 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-600"
      @dragover.prevent @drop.prevent="handleDrop">
      <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Drag and drop a file
              here</span></p>
          <p class="text-xs text-gray-500 dark:text-gray-400">PDF files (MAX. 300MB) {{ isHover }}</p>
          <span v-if="selectedFile"
            class="bg-green-200 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 mt-4">
            {{ selectedFile?.name }}</span>
          <p v-if="selectedFile"
            :class="colorSize">
            {{ sizeFileStr }}
            <span v-if="isTooBig" class="block text-center font-medium mt-1">Aumenta tu plan</span>
          </p>
        </div>
        <input id="dropzone-file" type="file" class="hidden" ref="fileInput" />
      </label>
      <button v-if="isTooBig && selectedFile && !isLoading"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="uploadFile()">Upload</button>
      </div>
      <Overlay :is-visible="isLoading" :text="'Subiendo archivo ...'" />
      <a v-if="lastLink.length > 0" :href="lastLink" :download="lastLink" target="_blank" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mx-auto">Descargar archivo</a>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios, { type AxiosResponse } from 'axios';
import { API_ROUTES } from '@/config/apiRoutes';
import Overlay from '@/components/atoms/Overlay/Overlay.vue';

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isHover = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const lastLink = ref<string>("")
const sizeFileStr = ref<string>("")
const isTooBig = ref<boolean>(false)
const colorSize = ref<string>("font-light bg-yellow-200 text-black text-xs me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-black mt-4")

const bytesToSize = (bytes: number): void => {
  if (bytes < 1024) {
    sizeFileStr.value = `Tu archivo pesa: ${bytes} bytes`;
    colorSize.value = `font-light bg-yellow-200 text-black text-xs me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-black mt-4`
    isTooBig.value = false;
  } else if (bytes < 1024 * 1024) {
    const kilobytes = bytes / 1024;
    sizeFileStr.value = `Tu archivo pesa: ${kilobytes.toFixed(2)} KB`;
    colorSize.value = `font-light bg-yellow-200 text-black text-xs me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-black mt-4`
    isTooBig.value = false;
  } else if (bytes < 1024*1024 && (bytes < 1024*1024) || (bytes / (1024 * 1024) < 31)) {
    const megabytes = bytes / (1024 * 1024);
    sizeFileStr.value = `Tu archivo pesa: ${megabytes.toFixed(2)} MB`;
    colorSize.value = `font-light bg-yellow-200 text-black text-xs me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-black mt-4`
    isTooBig.value = false;
  } else if ((bytes < 1024*1024) || (bytes / (1024 * 1024) > 30)) {
    const megabytes = bytes / (1024 * 1024);
    sizeFileStr.value = `Tu archivo pesa demasiado: ${megabytes.toFixed(2)} MB`;
    colorSize.value = `font-light bg-red-200 text-black text-xs me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-black mt-4`
    isTooBig.value = true;
  }
}

// Manejamos el evento de soltar en el div
const handleDrop = (event: DragEvent) => {
  console.log("File dropped:", event.dataTransfer?.files);
  const files = event.dataTransfer?.files;

  if (files && files.length > 0) {
    selectedFile.value = files[0];
    // toBase64(selectedFile.value)
    bytesToSize(selectedFile.value.size);
    // uploadFile()
  }
};

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  }).then((e:any)=> console.log(e));

const uploadFile = async () => {
  // Verificamos que haya un archivo seleccionado
  if (!selectedFile.value) return;
  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // Realizamos la solicitud POST
    const response: AxiosResponse<{ message: string; size: string }> = await axios.post<{ message: string; size: string }>(API_ROUTES.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    lastLink.value = `https://gcloud-report-518624809460.europe-southwest1.run.app/ok/${response.data.size}`
    // console.log(selectedFile.value, "File uploaded successfully.");


    isLoading.value = false;
    selectedFile.value = null
    fileInput.value = null

  } catch (error) {
    console.error(error);
    isLoading.value = false;
    alert("Failed to upload the file.");
  }
};
</script>
<style lang="css" scoped>
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>