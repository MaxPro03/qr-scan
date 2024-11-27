import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import OrderView from "@/views/OrderView.vue"
import QrScanView from "@/views/QrScanView.vue"
import OrderClientView from "@/views/OrderClientView.vue"
import OrderStorageView from "@/views/OrderStorageView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/client-order/:id",
      name: "clientOrder",
      component: OrderClientView,
    },
    {
      path: "/storage-order/:id",
      name: "storageOrder",
      component: OrderStorageView,
    },
    {
      path: "/qr-scan",
      name: "qrScan",
      component: QrScanView,
    },
  ],
})

export default router
