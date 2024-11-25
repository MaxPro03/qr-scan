import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import OrderView from "@/views/OrderView.vue";
import QrScanView from "@/views/QrScanView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/order/:id',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/qr-scan',
      name: 'qrScan',
      component: QrScanView,
    },
  ],
})

export default router
