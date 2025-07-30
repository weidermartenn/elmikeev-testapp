<template>
  <div class="font-display">
    <div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      <button
        v-for="page in pages"
        :key="page.id"
        class="button"
        :class="{ 'bg-zinc-600': page.name === activePage }"
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
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const activePage = ref("");

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

const setActivePage = () => {
  activePage.value = route.name?.toString() || "";
};

const selectPage = (page: { name: string }) => {
  activePage.value = page.name;
  router.push({ name: page.name });
};

watch(
  () => route.name,
  (newRouteName) => {
    activePage.value = newRouteName?.toString() || "";
  },
  { immediate: true }
);

setActivePage();
</script>

<style scoped></style>
