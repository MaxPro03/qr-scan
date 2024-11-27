<script setup>
import { computed, onMounted, ref } from "vue"
import UiOrderCard from "@/components/order/UiOrderCard.vue"
import { useApi } from "@/utils/composable/useApi.ts"
import { useTelegram } from "@/utils/composable/useTelegram"

const { tg } = useTelegram()

// Определение фильтров
const filters = ref([
  { label: "Все", value: "Все" },
  { label: "На доставке", value: 3 },
  { label: "Готов к отправке", value: 4 },
])

// Выбранный фильтр
const selectedFilter = ref("Все")

// Установка фильтра
const setFilter = (filterValue) => {
  selectedFilter.value = filterValue
}

const filteredItems = computed(() => {
  if (selectedFilter.value === "Все") {
    return orders.value
  }
  return orders.value.filter((item) => item.status === selectedFilter.value)
})

const orders = ref([])

const { data, error, loading, fetchData } = useApi(
  "/v1/telegram-bot/get-orders",
)

onMounted(async () => {
  // Запрашиваем данные при монтировании компонента
  await fetchData({
    telegram_user_id: tg?.initDataUnsafe?.user?.id,
    page: 1,
    size: 5,
  })
  orders.value = data.value.data.orders
})
</script>

<template>
  <div class="container max-w-[calc(100%-20px)] mx-auto relative mb-32">
    <img
      class="max-w-[224px] my-5 mx-auto"
      src="@/assets/images/logo.svg"
      alt=""
    />
    <div>
      <h2 class="font-medium text-lg mb-2.5">Заказы</h2>
      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="[
            'filter-button',
            { active: selectedFilter === filter.value },
          ]"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
      <div class="grid gap-[5px]">
        <RouterLink
          :to="{ name: 'clientOrder', params: { id: item.id } }"
          v-for="item in filteredItems"
        >
          <UiOrderCard :order-info="item" />
        </RouterLink>
      </div>
    </div>
    <!--    <div class="qr-scan-button-container">-->
    <!--      <RouterLink class="qr-scan-button" to="/qr-scan">-->
    <!--        <img src="@/assets/images/qr-scan.svg" alt="" />-->
    <!--        <span class="font-medium text-lg">Забрать заказ</span>-->
    <!--      </RouterLink>-->
    <!--    </div>-->
  </div>
</template>

<style>
.qr-scan-button-container {
  width: 100%;
  height: 140px;
  background: linear-gradient(
    to bottom,
    rgb(238, 242, 245, 0),
    rgb(225, 233, 238, 1)
  );
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.qr-scan-button {
  width: calc(100% - 20px);
  margin: 34px auto 0 auto;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background-color: #ffffff;
  border-radius: 16px;
}
</style>

<style scoped>
.filters {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.filter-button {
  padding: 0 15px;
  background-color: #ffffff;
  cursor: pointer;
  border-radius: 9999px;
  line-height: 41px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.filter-button.active {
  background-color: #ff690e;
  color: white;
}
</style>
