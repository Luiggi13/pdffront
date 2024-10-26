<script setup lang="ts">
import axiosInstance from '@/axios';
import { useUpload } from '@/composables/useUpload';
import { API_ROUTES } from '@/config/apiRoutes';
import { computed, ref, useTemplateRef } from 'vue';

const files = ref<any[]>([])
const uploadProgress = ref<number>(0);
const isUplading = ref<boolean>(false);
const uploads = useUpload()
// const handleUpload = async (e: any) => {
//     files.value = Array.from(e.target.files) || []
//     await uploads.uploadFiles(e.target.files[0])
// }
// const uploadInfo = computed(() => {
//     return files.value.length === 1
//         ? files.value[0].name
//         : `${files.value.length} files selected`
// })
const handleUpload = async(e: Event) => {
    // var uploadedFiles = useTemplateRef("fileAdd").value?.files!;
    console.log(e)
    // if (uploadedFiles.length > 0) {
    //     for (var i = 0; i < uploadedFiles.length; i++) {
    //         files.value.push(uploadedFiles[i]);
    //         var formData = new FormData();
    //         formData.append("files", useTemplateRef("fileAdd").value!.files![0]);
            // await axiosInstance
            //     .post(API_ROUTES.uploadFile, formData, {
            //         headers: {
            //             "Content-Type": "multipart/form-data",
            //         },
            //         onUploadProgress: (uploadStatus) => {
            //             uploadProgress.value = Math.round(
            //                 (uploadStatus.loaded / uploadStatus.total!) * 100
            //             );
            //             isUplading.value = true;
            //         },
            //     })
            //     .then((response) => {
            //         console.log(response)
            //     })
        // }
    // }
}
</script>
<template>
    <form class="w-full h-[400px]">
        <div v-if="!files.length" class="flex items-center justify-center w-full h-[400px] block">
            <label for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to
                            upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" name="files" ref="fileAdd" class="hidden" @change="(e)=> handleUpload(e)"
                    accept="application/pdf,.pdf" />
            </label>
        </div>
    </form>
    <!-- <small v-if="files.length" :class="`text-pink-600 block`">
        <slot name="file" :files="files" :uploadInfo="uploadInfo">
            {{ uploadInfo }}
        </slot>
    </small> -->

</template>