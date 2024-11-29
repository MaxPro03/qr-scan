import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import OrderView from "@/views/OrderView.vue"
// import QrScanView from "@/views/QrScanView.vue"
import OrderClientView from "@/views/OrderClientView.vue"
import OrderStorageView from "@/views/OrderStorageView.vue"
import QrScanClientView from "@/views/QrScanClientView.vue"
import QrScanStorageView from "@/views/QrScanStorageView.vue"

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
      path: "/storage-qr-scan",
      name: "qrScanStorage",
      component: QrScanStorageView,
    },
    {
      path: "/client-qr-scan",
      name: "qrScanClient",
      component: QrScanClientView,
    },
  ],
})

export default router
