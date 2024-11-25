<template>
  <span :class="badgeClass" :style="badgeStyle">
    <img v-if="color === 'green'" class="mr-1.5" src="@/assets/images/tick.svg" alt="">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'green', // Default to green, can be changed to blue or other colors later
    validator: (value: string) => ['green', 'blue', 'red', 'yellow'].includes(value), // Add more colors as needed
  },
})

const badgeClass = computed(() => `badge`)

const badgeStyle = computed(() => {
  switch (props.color) {
    case 'green':
      return { backgroundColor: '#DBF6CB', color: '#1C7C4C' }
    case 'blue':
      return { backgroundColor: '#CCE4FF', color: '#002889' }
    case 'yellow':
      return { backgroundColor: '#FFF2DD', color: '#C57718' }
    // Add more colors as needed
    default:
      return { backgroundColor: '#CBFED3', color: '#16A05E' } // Default to green if no match
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  border-radius: 10px;
  font-size: 13px;
  line-height: 23px;
  font-weight: 500;
  padding: 0 7px;
  align-items: center;
  width: fit-content;
}
</style>
