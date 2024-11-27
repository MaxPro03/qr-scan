<script setup lang="ts">
import { useRoute } from "vue-router"
import UiProductCard from "@/components/order/UiProductCard.vue"
import UiBadge from "@/components/order/UiBadge.vue"
import { onMounted, ref } from "vue"
import UiInfoBlock from "@/components/order/UiInfoBlock.vue"
import { useApi } from "@/utils/composable/useApi"
import { useTelegram } from "@/utils/composable/useTelegram"

const { tg } = useTelegram()

const route = useRoute()

const products = ref([
  // {
  //   id: 1,
  //   status: 1,
  //   count: 12,
  //   name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
  //   image: "/images/watch.png",
  // },
  // {
  //   id: 2,
  //   status: 2,
  //   count: 12,
  //   name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
  //   image: "/images/fan.png",
  // },
  // {
  //   id: 3,
  //   status: 1,
  //   count: 12,
  //   name: "Кофе в зернах Lavazza Crema e Aroma Espresso, 1 кг",
  //   image: "/images/new-qr.png",
  // },
])

const store = ref({})

// const infoBlocks = ref([
//   {
//     id: 1,
//     name: "Apple Store Malika B29",
//     description: "Ташкент, Юнусабад-14, д.30 кв. 28, этаж 2",
//   },
//   {
//     id: 2,
//     name: "Technoshop Market",
//     description: "Ташкент, Юнусабад-14, д.30 кв. 28, этаж 2",
//   },
// ])

const { data, error, loading, fetchData } = useApi(
  "/v1/telegram-bot/get-store-products",
)

onMounted(async () => {
  // Запрашиваем данные при монтировании компонента
  await fetchData({
    telegram_user_id: tg?.initDataUnsafe?.user?.id,
    store_id: route.params.id,
  })
  products.value = data.value.data.products
  store.value = data.value.data.store
})
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
      <div class="bg-white px-4 py-2.5 rounded-2xl">
        <div class="py-2.5 mb-2.5 flex justify-between items-center">
          <UiBadge color="yellow">В процессе сборки</UiBadge>
          <span class="text-sm font-light">Собрано 1 из 3</span>
        </div>
        <div v-for="item in products" :key="item.id" class="border-t">
          <UiProductCard :product="item"></UiProductCard>
        </div>
      </div>
      <div class="grid gap-[5px] mt-2.5">
        <UiInfoBlock :info="store"></UiInfoBlock>
      </div>
    </div>
    <div class="qr-scan-button-container">
      <RouterLink class="qr-scan-button" to="/qr-scan">
        <img src="@/assets/images/qr-scan.svg" alt="" />
        <span class="font-medium text-lg">Принят товар</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
