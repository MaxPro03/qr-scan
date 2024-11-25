<script setup lang="ts">
import { RouterView } from 'vue-router'
import {ref} from "vue";
import { useTelegram } from './utils/composable/useTelegram.ts';
import UiOrderCard from "@/components/order/UiOrderCard.vue";
const { tg } = useTelegram();

const userId = ref(tg?.initDataUnsafe?.user?.id);
const username = ref(tg?.initDataUnsafe?.user?.username);
const chatId = ref(tg?.initDataUnsafe?.chat?.id);

const orders = ref([
  {
    id: 123,
    number: '725',
    status: 1,
    count: 12,
  },
  {
    id: 123,
    number: '724',
    status: 1,
    count: 12,
  },
  {
    id: 123,
    number: '723',
    status: 2,
    count: 12,
  },
  {
    id: 123,
    number: '722',
    status: 2,
    count: 6,
  },
  {
    id: 123,
    number: '721',
    status: 2,
    count: 3,
  },
])
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped></style>
