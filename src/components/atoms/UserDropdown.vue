<script setup lang="ts">
const props = defineProps<{
  username: string;
}>();
</script>
<template>
  <span class="w-18 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full mr-5">
    <b class="capitalize">👋🏻 {{ props.username }}</b></span>
  <div>
    <a class="text-blueGray-500 block">
      <div class="items-center flex">
        <span class="w-12 h-12 text-sm text-black bg-blueGray-200 inline-flex items-center justify-center rounded-full">
          <img alt="..." class="w-full rounded-full align-middle border-none shadow-lg"
            src="@/assets/team-1-800x800.jpg" />
        </span>
      </div>
    </a>
  </div>
</template>