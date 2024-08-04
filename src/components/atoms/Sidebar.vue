<script lang="ts" setup>
import { ref } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { onBeforeMount } from 'vue';

const props = defineProps<{
  username: string;
  isPremium: boolean;
}>();
const emit = defineEmits<{
  (e: 'logout'): void;
}>();
const collapseShow = ref('hidden')
const toggleCollapseShow = (classes: string) => {
  collapseShow.value = classes;
}
const currentYear = computed(() => new Date().getFullYear())

const currentRoute = ref('')
const route = useRoute();
const calcCurrentRoute = () => currentRoute.value = route.path
const isActive = (myroute: string) => {
  return currentRoute.value === myroute.toLocaleLowerCase()
}

onBeforeMount(() => {
  calcCurrentRoute();
});
</script>
<template>
  <nav
    class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
    <div
      class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
      <!-- Toggler -->
      <button
        class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
        type="button" v-on:click="toggleCollapseShow('bg-white m-2 py-3 px-6')">
        <i class="fas fa-bars"></i>
      </button>
      <!-- Brand -->
      <a class="md:block text-left md:pb-2 text-green-600 mr-0 inline-block whitespace-nowrap text-sm capitalize font-bold p-4 px-0"
        href="javascript:void(0)">
        Christmas Dinner {{ currentYear }}
      </a>
      <!-- Collapse -->
      <div
        class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded"
        v-bind:class="collapseShow">
        <!-- Collapse header -->
        <div class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
          <div class="flex flex-wrap">
            <div class="w-6/12">
              <a class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                href="javascript:void(0)">
                Christmas Dinner {{ new Date().getFullYear() }}
              </a>
            </div>
            <div class="w-6/12 flex justify-end">
              <button type="button"
                class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                v-on:click="toggleCollapseShow('hidden')">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- Navigation -->
        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center">
            <a :class="{ 'text-green-500': isActive('/dashboard') }"
              class="hover:text-green-600 text-xs uppercase py-3 font-bold block"><i
                class="fas fa-tv opacity-75 mr-2 text-sm"></i>
              <router-link to="/dashboard">Dashboard</router-link>
            </a>
          </li>
          <li class="items-center">
            <a :class="{ 'text-green-500': isActive('/restaurants') }"
              class="hover:text-green-600 text-xs uppercase py-3 font-bold block"><i
                class="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>
              <router-link to="/restaurants">Restaurants</router-link></a>
            <ul class="md:flex-col md:min-w-full flex flex-col list-none">
              <li class="hover:text-green-600 text-xs py-1 block pl-5">
                <router-link to="/add"><i class="fa-regular fa-plus pr-2"></i>Add restaurant</router-link>
              </li>
              <li class="hover:text-green-600 text-xs py-1 block pl-5">
                <router-link to="/edit"><i class="fa-regular fa-pen-to-square pr-2"></i>Edit restaurant</router-link>
              </li>
            </ul>
          </li>
        </ul>
        <hr class="my-4 md:min-w-full" />
        <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
          <li class="inline-flex">
            <a class="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold cursor-pointer"
              @click="emit('logout')"><i class="fas fa-sign-out mr-2 text-blueGray-400 text-base"></i>
              Logout</a>
          </li>
        </ul>

      </div>
    </div>
    <slot />
  </nav>
</template>