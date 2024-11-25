<script setup lang="ts">
import UiBadge from "@/components/order/UiBadge.vue";

defineProps<{
  orderInfo: object
}>()

const statusColor = (status) => {
  switch (status) {
    case 1:
      return 'blue'
    case 2:
      return 'green'
    default:
      return 'blue'
  }
}

const badgeTitle = (status) => {
  switch (status) {
    case 1:
      return 'Собирается'
    case 2:
      return 'Готов в отправке'
    default:
      return ''
  }
}
</script>

<template>
  <div class="rounded-2xl bg-white p-4 flex gap-3 justify-between items-center cursor-pointer">
    <div class="grid gap-3">
      <span class="font-medium text-lg"># {{orderInfo.number}}</span>
      <div class="flex items-center gap-[10px]">
        <UiBadge :color="statusColor(orderInfo.status)">{{ badgeTitle(orderInfo.status) }}</UiBadge>
        <span class="text-[#707579] text-xs">Товары: {{orderInfo.count}}</span>
      </div>
    </div>
    <img class="mr-2.5" src="@/assets/images/arrow-right.svg" alt="">
  </div>
</template>

<style scoped>

</style>