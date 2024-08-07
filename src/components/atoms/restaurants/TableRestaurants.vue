<script lang="ts" setup>
import type { Restaurants } from '@/types/restaurants.types';

const props = defineProps<{
  places: Restaurants[];
}>();
const headersTable: readonly string[] = ['Name', 'Dirección', 'Actions'];
</script>
<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-green-500 dark:text-green-900">
        <tr>
          <th v-for="(headerName, index) in headersTable" :key="index" scope="col" class="px-6 py-3">
            {{ headerName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(place, index) in props.places" :key="index"
          class="border-b dark:bg-gray-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-white">
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap dark:text-white w-[25%]">
            {{ place.name }}
          </th>
          <td class="px-6 py-4 w-[50%]">
            {{ place.street }}
          </td>
          <td class="px-6 py-4 w-[25%]">
            <button
              class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1"
              type="button" style="transition:all .15s ease" @click.prevent="">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
