<script setup lang="ts">
import UiBadge from "@/components/order/UiBadge.vue"

defineProps<{
  product: object
  isWithoutBadge: boolean
}>()

const statusColor = (status) => {
  switch (status) {
    case 1:
      return "green"
    case 2:
      return "yellow"
    default:
      return "blue"
  }
}

const badgeTitle = (status) => {
  switch (status) {
    case 1:
      return "Получен"
    case 2:
      return "В ожидании"
    default:
      return ""
  }
}
</script>

<template>
  <div class="flex gap-4 bg-white py-5 items-start cursor-pointer">
    <div class="w-[50px] h-[60px]">
      <img class="w-full object-contain" :src="product.image" alt="" />
    </div>
    <div class="grid gap-[5px]">
      <p class="text-xs mb-0">{{ product.name }}</p>
      <span class="text-xs">Количество: {{ product.count }}</span>
      <UiBadge
        v-if="!isWithoutBadge"
        class="mt-1"
        :color="statusColor(product.status)"
        >{{ badgeTitle(product.status) }}
      </UiBadge>
    </div>
  </div>
</template>

<style scoped></style>
