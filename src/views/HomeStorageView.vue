<script setup>
import { ref } from "vue"
import UiOrderCard from "@/components/order/UiOrderCard.vue"

const orders = ref([
  {
    id: 123,
    number: "725",
    status: 1,
    count: 12,
  },
  {
    id: 123,
    number: "724",
    status: 1,
    count: 12,
  },
  {
    id: 123,
    number: "723",
    status: 2,
    count: 12,
  },
  {
    id: 123,
    number: "722",
    status: 2,
    count: 6,
  },
  {
    id: 123,
    number: "721",
    status: 2,
    count: 3,
  },
])
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
      <div class="grid gap-[5px]">
        <RouterLink
          :to="{ name: 'order', params: { id: item.number } }"
          v-for="item in orders"
        >
          <UiOrderCard :order-info="item" />
        </RouterLink>
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
