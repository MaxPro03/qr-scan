<script setup lang="ts">
defineProps<{
  info: object
}>()
</script>

<template>
  <div
    class="rounded-2xl bg-white p-4 grid grid-cols-[1fr_110px] gap-6 items-center justify-between"
  >
    <div class="grid gap-1">
      <h1 class="text-[17px] font-medium mb-0">{{ info.store_name }}</h1>
      <p class="text-[13px] text-secondary font-light">
        {{ info.store_address }}
      </p>
    </div>
    <div class="flex items-center gap-2.5 justify-self-end">
      <img src="@/assets/images/location.svg" alt="" />
      <img src="@/assets/images/call.svg" alt="" />
    </div>
  </div>
</template>

<style scoped></style>
