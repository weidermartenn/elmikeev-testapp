<template>
  <div class="h-full flex flex-col justify-start items-center">
    <form @submit.prevent="handleSubmit" class="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 w-full max-w-4xl">
      <div class="flex flex-col">
        <label for="dateFrom" class="mb-1 text-sm font-medium">От</label>
        <input
          id="dateFrom"
          class="input input-bordered"
          type="date"
          v-model="form.dateFrom"
          :max="form.dateTo || ''"
        />
        <span v-if="errors.dateFrom" class="text-red-500 text-xs mt-1">{{ errors.dateFrom }}</span>
      </div>
      
      <div class="flex flex-col">
        <label for="dateTo" class="mb-1 text-sm font-medium">До</label>
        <input
          id="dateTo"
          class="input input-bordered"
          type="date"
          v-model="form.dateTo"
          :min="form.dateFrom || ''"
        />
        <span v-if="errors.dateTo" class="text-red-500 text-xs mt-1">{{ errors.dateTo }}</span>
      </div>
      
      <div class="flex flex-col">
        <label for="search" class="mb-1 text-sm font-medium">Поиск</label>
        <input
          id="search"
          class="input input-bordered"
          type="text"
          v-model="form.search"
          placeholder="Артикул или ID"
          @input="debouncedSearch"
        />
      </div>
      
      <div class="flex flex-col">
        <label for="page" class="mb-1 text-sm font-medium">Страница</label>
        <input
          id="page"
          class="input input-bordered"
          type="number"
          min="1"
          v-model.number="form.page"
          @change="validatePage"
        />
        <span v-if="errors.page" class="text-red-500 text-xs mt-1">{{ errors.page }}</span>
      </div>
    </form>

    <div class="p-4">
      <h1 v-if="ordersStore.allOrders.meta" class="text-xl text-left mb-2">
        Страница: {{ ordersStore.allOrders.meta.current_page }} из {{ ordersStore.allOrders.meta.last_page }}
      </h1>
    </div>
    <div class="max-h-[60vh] overflow-x-auto overflow-y-scroll p-4 rounded-sm border border-base-content/5 bg-base-100 w-full max-w-6xl">
      <div v-if="loading" class="flex justify-center my-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      
      <table v-else class="table table-xs sm:table-sm md:table-md">
        <thead>
          <tr class="text-left">
            <th v-for="header in tableHeaders" :key="header.id">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="item.income_id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.income_id }}</td>
            <td>
              {{ formatDate(item.date) }} <br />
              <span class="text-xs text-gray-400">
                (изменено: {{ formatDate(item.last_change_date) }})
              </span>
            </td>
            <td>{{ item.supplier_article }}</td>
            <td>{{ formatCurrency(item.total_price) }}</td>
            <td>{{ item.discount_percent }}%</td>
            <td>{{ item.warehouse_name }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="!filteredItems.length && !loading" class="text-center py-8 text-gray-500">
        Данные не найдены
      </div>
    </div>

    <div v-if="ordersStore.allOrders.meta" class="join grid grid-cols-2 mt-4">
      <button
        @click="prevPage"
        :disabled="disablePrevPage"
        class="join-item btn btn-outline"
        :class="{ 'btn-disabled': disablePrevPage }"
      >
        <
      </button>
      <button
        @click="nextPage"
        :disabled="disableNextPage"
        class="join-item btn btn-outline"
        :class="{ 'btn-disabled': disableNextPage }"
      >
        >
      </button>
    </div>

    <div class="mt-4 mb-10 overflow-x-auto overflow-y-scroll p-4 rounded-sm border border-base-content/5 bg-base-100 w-full max-w-6xl">
      <h1 class="text-xl text-left mb-2">
        График заказов
      </h1>
      <OrdersChart :orders-data="filteredItems" defer/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useOrdersStore } from "../model/store";
import { debounce } from "@/features/debounce";
import OrdersChart from "./OrdersChart.vue";

const tableHeaders = [
  { id: 1, title: "#" },
  { id: 2, title: "ID" },
  { id: 3, title: "Дата" },
  { id: 4, title: "Артикул" },
  { id: 5, title: "Сумма" },
  { id: 6, title: "Скидка" },
  { id: 7, title: "Склад" },
];

const ordersStore = useOrdersStore();
const loading = ref(false);

const form = ref({
  dateFrom: "2025-01-01",
  dateTo: "2025-02-02",
  search: "",
  page: 1,
});

const errors = ref({
  dateFrom: "",
  dateTo: "",
  page: "",
});

const validateForm = () => {
  let isValid = true;
  errors.value = { dateFrom: "", dateTo: "", page: "" };

  if (form.value.dateFrom && form.value.dateTo && form.value.dateFrom > form.value.dateTo) {
    errors.value.dateFrom = "Дата 'От' не может быть позже даты 'До'";
    isValid = false;
  }

  if (form.value.page < 1) {
    errors.value.page = "Номер страницы должен быть больше 0";
    isValid = false;
  }

  return isValid;
};

const validatePage = () => {
  if (form.value.page < 1) {
    form.value.page = 1;
  }
};

const debouncedSearch = debounce(() => {
  fetchData();
}, 500);

const filteredItems = computed(() => {
  if (!form.value.search) return ordersStore.allOrders.data || [];
  
  const searchTerm = form.value.search.toLowerCase();
  return (ordersStore.allOrders.data || []).filter(item => 
    item.supplier_article.toLowerCase().includes(searchTerm) ||
    item.income_id.toString().includes(searchTerm))
});

const fetchData = async () => {
  if (!validateForm()) return;
  
  try {
    loading.value = true;
    await ordersStore.fetchOrders(
      form.value.dateFrom,
      form.value.dateTo,
      form.value.page
    );
  } catch (err) {
    console.error("Ошибка загрузки данных:", err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = () => {
  fetchData();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
};

const formatCurrency = (value: string) => {
  return parseFloat(value).toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2
  });
};

const disablePrevPage = computed(() => {
  return (
    !ordersStore.allOrders.meta ||
    ordersStore.allOrders.meta.current_page === 1
  );
});

const prevPage = async () => {
  if (disablePrevPage.value) return;
  form.value.page = ordersStore.allOrders.meta.current_page - 1;
  await fetchData();
};

const disableNextPage = computed(() => {
  return (
    !ordersStore.allOrders.meta ||
    ordersStore.allOrders.meta.current_page === ordersStore.allOrders.meta.last_page
  );
});

const nextPage = async () => {
  if (disableNextPage.value) return;
  form.value.page = ordersStore.allOrders.meta.current_page + 1;
  await fetchData();
};

watch(
  () => [form.value.dateFrom, form.value.dateTo, form.value.page],
  () => {
    fetchData();
  },
  { deep: true }
);

onMounted(async () => {
  await fetchData();
});
</script>