<script setup lang="ts">
import { QrcodeStream } from "vue-qrcode-reader"
import { onMounted, ref } from "vue"

const selectedConstraints = ref({ facingMode: "environment" })
const cameraFacingMode = ref("environment") // По умолчанию используем заднюю камеру
const defaultConstraintOptions = [
  { label: "rear camera", constraints: { facingMode: "environment" } },
  { label: "front camera", constraints: { facingMode: "user" } },
]
const constraintOptions = ref(defaultConstraintOptions)
const torchActive = ref(false)

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = "orange"

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

async function onCameraReady(capabilities) {
  console.log("onCameraReady", capabilities)

  // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
  // camera access permission. `QrcodeStream` internally takes care of
  // requesting the permissions. The `camera-on` event should guarantee that this
  // has happened.
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(({ kind }) => kind === "videoinput")
  console.log("devices", devices)

  constraintOptions.value = [
    ...defaultConstraintOptions,
    ...videoDevices.map(({ deviceId, label }) => ({
      label: `${label} (ID: ${deviceId})`,
      constraints: { deviceId },
    })),
  ]
}

function onDetect(detectedCodes) {
  console.log("detected", detectedCodes[0].rawValue)
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  // detectedCodes.map((code) => code.rawValue)
  sendPostRequest(detectedCodes[0].rawValue)
  // console.log('detected', result.value)
}

const sendPostRequest = async (id) => {
  loading.value = true
  errorMessage.value = ""
  successMessage.value = ""

  try {
    const response = await fetch(
      `https://admin.gogomarket.uz/api/v2/order/confirm-order-delivery?id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Ошибка. попробуйте снова")
    }

    successMessage.value = "Успешно"
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onCameraReady()
  document.fullscreenElement
})
</script>

<template>
  <div class="fullscreen bg-black pt-[50px] pb-[120px]">
    <div
      class="relative fullscreen mt-[50px] mb-[120px] rounded-[30px] overflow-hidden"
    >
      <span
        class="absolute mt-[35px] flex w-full justify-center z-20 text-white text-[20xp]"
        >Баркод сканнер</span
      >
      <div class="w-full flex justify-center">
        <img
          class="absolute z-20 w-full top-[140px] justify-center max-w-[270px]"
          src="@/assets/images/qr-borders.svg"
          alt=""
        />
      </div>
      <QrcodeStream
        :torch="torchActive"
        :constraints="selectedConstraints"
        :track="paintOutline"
        :formats="['qr_code', 'code_128']"
        @detect="onDetect"
        :facingMode="cameraFacingMode"
        @camera-on="onCameraReady"
      >
      </QrcodeStream>
      <div class="absolute right-[22px] top-[20px] z-20">
        <RouterLink to="/">
          <img src="@/assets/images/exit.svg" alt="" />
        </RouterLink>
      </div>
      <div class="absolute bottom-[22px] right-[20px] z-20">
        <img
          @click="torchActive = !torchActive"
          src="@/assets/images/flash.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
