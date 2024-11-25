<script setup lang="ts">
import { useRoute } from "vue-router"
import UiProductCard from "@/components/order/UiProductCard.vue"
import UiBadge from "@/components/order/UiBadge.vue"
import { ref } from "vue"
import UiInfoBlock from "@/components/order/UiInfoBlock.vue"

const route = useRoute()

const products = ref([
  {
    id: 1,
    status: 1,
    count: 12,
    name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
    image: "/images/watch.png",
  },
  {
    id: 2,
    status: 2,
    count: 12,
    name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
    image: "/images/fan.png",
  },
  {
    id: 3,
    status: 1,
    count: 12,
    name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
    image: "/images/new-qr.png",
  },
])

const openGoogleMaps = () => {
  const latitude = 41.2995 // Например, координаты Ташкента
  const longitude = 69.2401

  // Формируем ссылку
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`

  // Открываем ссылку в новом окне/приложении
  window.open(url, "_blank")
}
</script>

<template>
  <div class="container max-w-[calc(100%-20px)] mx-auto relative mb-32">
    <div>
      <RouterLink
        class="rounded-2xl bg-white p-2.5 flex items-center cursor-pointer mt-5 mb-2.5"
        to="/"
      >
        <img
          class="ml-2.5 rotate-180"
          src="@/assets/images/arrow-right.svg"
          alt=""
        />
        <div class="grid gap-1 w-full justify-center text-center -ml-4">
          <h1 class="text-primary">Заказ № {{ route.params.id }}</h1>
          <span class="text-secondary text-xs font-light">Товаров 3</span>
        </div>
      </RouterLink>
      <h2 class="font-medium text-lg mb-2.5">Получатель</h2>
      <div class="bg-white px-4 py-6 rounded-2xl mb-2.5 grid gap-[15px]">
        <div class="grid grid-cols-[1fr_50px] items-center gap-5">
          <h1 class="text-[17px] font-medium">Алиев Алишер Дильмурадович</h1>
          <a href="tel:+1234567890">
            <img src="@/assets/images/call.svg" alt="" />
          </a>
        </div>
        <div class="grid gap-1">
          <span class="text-secondary text-xs font-light">Время доставки</span>
          <span class="text-[17px] font-medium">23.11.2024 / 12:00</span>
          <span class="text-secondary text-xs font-light"
            >Ташкент, Юнусабад-14, д.30 кв. 28, этаж 2</span
          >
        </div>
        <button @click="openGoogleMaps" class="button-secondary">
          <img src="@/assets/images/location-icon.svg" alt="" />
          <span class="block"> Проложить маршрут </span>
        </button>
      </div>
      <div class="bg-white px-4 py-2.5 rounded-2xl">
        <div
          v-for="item in products"
          :key="item.id"
          class="border-t first:border-0"
        >
          <UiProductCard is-without-badge :product="item"></UiProductCard>
        </div>
      </div>
    </div>
    <div class="qr-scan-button-container">
      <RouterLink class="qr-scan-button" to="/qr-scan">
        <img src="@/assets/images/qr-scan.svg" alt="" />
        <span class="font-medium text-lg">Передать заказ клиенту</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.button-secondary {
  height: 50px;
  display: flex;
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 400;
  background-color: #efeff4;
  border-radius: 30px;
  gap: 5px;
  width: fit-content;
}
</style>
