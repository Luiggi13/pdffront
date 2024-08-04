<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { onBeforeMount } from 'vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

const authStore = useAuthStore();
const router = useRouter();
const isLogged = computed(() => authStore.isLoggedIn);
const userProfile = ref({ username: '', password: '' });
const isEnabled = computed(() => {
  if (userProfile.value.username && userProfile.value.password) return false;
  return true;
})

const navigateToHome = () => router.push('/dashboard');

const loginUsers = async () => {
  await authStore.postLogin(userProfile.value.username, userProfile.value.password);
  if (isLogged) navigateToHome();
}

onBeforeMount(() => {
  if (authStore.isLoggedIn) navigateToHome();
})

const pdf = () => {
  const data = [
    { "name": "John Doe", "age": 29, "email": "john@example.com" },
    { "name": "Jane Smith", "age": 32, "email": "jane@example.com" },
    { "name": "Sam Johnson", "age": 23, "email": "sam@example.com" }
  ];
  const doc = new jsPDF();
  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Age', dataKey: 'age' },
    { header: 'Email', dataKey: 'email' }
  ];

  const columnStyles = {
    name: { cellWidth: 50 }, // Ancho de columna para 'Name'
    age: { cellWidth: 20 },  // Ancho de columna para 'Age'
    email: { cellWidth: 80 } // Ancho de columna para 'Email'
  };

  // Generar la tabla en el PDF
  autoTable(doc, {
    columns: columns,
    body: data,
    columnStyles: columnStyles
  });

  // Guardar el PDF
  doc.save('table.pdf');
}
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-16 w-auto rounded-full hover:h-24 hover:transition-all transition-all"
        src="../assets/cbre.png" alt="CBRE" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Iniciar sesión
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Usuario</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" required="true"
              v-model="userProfile.username"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" required="true" v-model="userProfile.password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all disabled:bg-gray-500"
            :disabled="isEnabled" @click="loginUsers">Sign
            in</button>
        </div>
      </form>
    </div>
  </div>
</template>