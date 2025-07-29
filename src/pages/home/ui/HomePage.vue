<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
    <div class="w-full max-w-md flex flex-col items-center p-6 rounded-lg shadow-md bg-white">
      <div class="flex flex-col sm:flex-row items-center justify-center sm:gap-4">
        <img 
          :src="logo" 
          alt="Логотип"
          class="w-24 sm:w-28 h-auto object-contain"
        />
        <img 
          :src="logo2" 
          alt="Дополнительное лого"
          class="w-28 sm:w-32 h-auto object-contain"
        />
      </div>
      
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
        Ельмикеев Аналитика
      </h1>
      <span class="text-sm sm:text-base text-gray-600">
        Тестовое задание by f14
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "@/app/assets/flogo_light.svg";
import logo2 from "@/app/assets/7079235.jpeg";
</script>
