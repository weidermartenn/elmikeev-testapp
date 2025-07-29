<template>
  <div class="font-display">
    <div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-2 ">
      <button
        v-for="page in pages"
        :key="page.id"
        class="button"
        @click="router.push({ name: page.name })"
      >
        {{ page.title }}
      </button>
    </div>
    <div class="w-full max-h-[calc(100vh-150px)]"> 
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const pages = [
  {
    id: 1,
    title: "Доходы",
    name: "incomes",
  },
  {
    id: 2,
    title: "Заказы",
    name: "orders",
  },
  {
    id: 3,
    title: "Продажи",
    name: "sales",
  },
  {
    id: 4,
    title: "Акции",
    name: "stocks",
  },
];
</script>

<style scoped></style>
