<script lang="ts" setup>
import type { Restaurants } from '@/types/restaurants.types';
import { useRouter } from 'vue-router';
import type { Header } from "vue3-easy-data-table";

const props = defineProps<{
  places: Restaurants[];
}>();

const emit = defineEmits<{
  (e: "delete-restaurant", place: Restaurants): void;
  (e: "edit-restaurant", placeId: string): void;
}>();

const headers: readonly Header[] = [
  { text: "Name", value: "name", sortable: true },
  { text: "Dirección", value: "street", },
  { text: "Status", value: "enabled" },
  { text: "Actions", value: "actions", width: 220 }
];
const router = useRouter();
const newRestaurant = () => router.push('/add');
</script>
<template>
  <div class="inline-flex w-full justify-end">
    <button type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset hover:bg-blue-700 sm:mt-0 sm:w-auto float-end"
      @click="newRestaurant">
      <span>
        <i class="fas fa-plus"></i> Nuevo restaurante
      </span>
    </button>
  </div>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
    <EasyDataTable :headers="headers" :items="props.places" :hide-footer="true" alternating>
      <template #item-enabled="item">
        <span v-if="item.enabled"
          class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Activado</span>
        <span v-else
          class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Desactivado</span>
      </template>
      <template #item-actions="item">
        <button
          class="bg-slate-100 text-black active:bg-slate-300 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-4 mt-5 mb-5 w-[85px]"
          type="button" style="transition:all .15s ease" @click.prevent="emit('edit-restaurant', item._id)">
          <i class="fa-regular fa-pen-to-square pr-2"></i> Editar
        </button>
        <button
          class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mt-5 mb-5 w-[85px]"
          type="button" style="transition:all .15s ease" @click.prevent="emit('delete-restaurant', item)">
          <i class="fa-solid fa-trash pr-2"></i> Eliminar
        </button>
      </template>
      <template #empty-message>
        <p>No hay restaurantes disponibles</p>
      </template>
    </EasyDataTable>
  </div>
</template>