<template>
  <div class="qr-scanner">
    <div class="qr-scanner-logo">
      <img src="@/assets/images/gogo_logo.png" alt="" />
    </div>
    <h1>{{ result }}</h1>
    <div v-if="cameraPermissionDenied" class="error">
      Доступ к камере был запрещен. Пожалуйста, разрешите доступ в настройках браузера.
      <div class="controls">
        <button @click="requestCameraPermission">Запросить доступ к камере снова</button>
      </div>
    </div>

    <div class="scanner-container" v-if="!cameraPermissionDenied">
      <QrcodeStream
        :constraints="selectedConstraints"
        :track="paintOutline"
        :formats="['qr_code']"
        @detect="onDetect"
        :facingMode="cameraFacingMode"
        @camera-on="onCameraReady">
      </QrcodeStream>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="loader">Загрузка...</div>

    <!-- Error Dialog -->
    <Dialog v-if="errorMessage" :title="'Ошибка!'" :message="errorMessage" @close="closeErrorDialog" />

    <!-- Success Dialog -->
    <Dialog v-if="successMessage" :title="'Успешно!'" :message="successMessage" @close="closeSuccessDialog" />

    <!-- <div v-if="decodedUrl" class="result">
      Результат:
      <a :href="decodedUrl" target="_blank">{{ decodedUrl }}</a>
    </div> -->

    <!-- <div v-if="!decodedUrl" class="search-message">Пожалуйста, наведите камеру на QR-код.</div> -->
  </div>
</template>

<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import Dialog from '@/components/Dialog.vue'
import { ref, onMounted } from 'vue'
const rearCameraSelected = ref(false)
const frontCameraSelected = ref(false)
const decodedUrl = ref(null)
const result = ref(null)
const cameraPermissionDenied = ref(false)
const cameraFacingMode = ref('environment') // По умолчанию используем заднюю камеру
const defaultConstraintOptions = [
  { label: 'rear camera', constraints: { facingMode: 'environment' } },
  { label: 'front camera', constraints: { facingMode: 'user' } },
]
const constraintOptions = ref(defaultConstraintOptions)
const selectedConstraints = ref({ facingMode: 'environment' })

// Реактивные переменные для состояний
// const loading = ref(false)
// const errorMessage = ref(null)
// const successMessage = ref(null)

// Функция для отправки POST запроса
// const submitForm = async (id) => {
//   loading.value = true
//   errorMessage.value = null
//   successMessage.value = null

//   try {
//     const response = await fetch(`https://admin.gogomarket.uz/api/v2/order/confirm-order-delivery?id=${id}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//     })

//     if (!response.ok) {
//       throw new Error('Failed to submit form.')
//     }

//     const result = await response.json()
//     successMessage.value = `Success: ${result.message}`
//   } catch (error) {
//     errorMessage.value = error.message
//   } finally {
//     loading.value = false
//   }
// }
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('rwar')

const sendPostRequest = async (id) => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`https://admin.gogomarket.uz/api/v2/order/confirm-order-delivery?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Ошибка. попробуйте снова')
    }

    successMessage.value = 'Успешно'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const closeErrorDialog = () => {
  errorMessage.value = ''
}

const closeSuccessDialog = () => {
  successMessage.value = ''
}

// onMounted(() => {
//   onCameraReady()
// })

// async function checkCameraPermission() {
//   try {
//     const result = await navigator.permissions.query({ name: 'camera' })
//     cameraPermissionDenied.value = result.state === 'denied'
//   } catch (error) {
//     console.error('Ошибка при проверке разрешения камеры:', error)
//     cameraPermissionDenied.value = true
//   }
// }

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'orange'

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
  console.log('onCameraReady', capabilities)

  // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
  // camera access permission. `QrcodeStream` internally takes care of
  // requesting the permissions. The `camera-on` event should guarantee that this
  // has happened.
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')
  console.log('devices', devices)

  constraintOptions.value = [
    ...defaultConstraintOptions,
    ...videoDevices.map(({ deviceId, label }) => ({
      label: `${label} (ID: ${deviceId})`,
      constraints: { deviceId },
    })),
  ]

  console.log('constraintOptions', constraintOptions.value)
}

// async function requestCameraPermission() {
//   try {
//     await navigator.mediaDevices.getUserMedia({ video: true })
//     cameraPermissionDenied.value = false
//     console.log('Доступ к камере получен')
//     checkCameraPermission()
//   } catch (error) {
//     if (error.name === 'NotAllowedError') {
//       console.error('Ошибка: доступ к камере был отклонён.')
//       alert('Доступ к камере был отклонён. Пожалуйста, измените настройки браузера.')
//       cameraPermissionDenied.value = true
//     } else {
//       console.error('Ошибка при запросе доступа к камере:', error)
//       cameraPermissionDenied.value = true
//     }
//   }
// }

async function onDetect(detectedCodes) {
  console.log('detected', detectedCodes[0].rawValue)
  result.value = await JSON.stringify(detectedCodes.map((code) => code.rawValue))
  // detectedCodes.map((code) => code.rawValue)
  sendPostRequest(detectedCodes[0].rawValue)
  // console.log('detected', result.value)
}

async function onInit(promise) {
  console.log(promise)

  try {
    const { streams } = await promise
    console.log('Доступные потоки камер:', streams)

    const rearCamera = streams.find(
      ({ device }) => device.kind === 'videoinput' && device.label.toLowerCase().includes('back')
    )

    if (rearCamera) {
      rearCameraSelected.value = true
      cameraFacingMode.value = 'environment' // Используем заднюю камеру
    } else {
      frontCameraSelected.value = streams.some(
        ({ device }) => device.kind === 'videoinput' && device.label.toLowerCase().includes('front')
      )
      cameraFacingMode.value = frontCameraSelected.value ? 'user' : '' // Если передняя камера доступна, используем ее
    }
  } catch (error) {
    console.error('Ошибка при инициализации камеры:', error)
    cameraPermissionDenied.value = true
  }
}
</script>

<style scoped>
.qr-scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Высота на всю высоту экрана */
}

.scanner-container {
  position: relative;
  width: 100%;
  max-width: 300px; /* Максимальная ширина блока сканера */
  aspect-ratio: 1; /* Соотношение сторон 1:1 */
  overflow: hidden; /* Скрытие всего, что выходит за пределы контейнера */
  border-radius: 15px; /* Скругление углов */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Тень для блока */
}

.result {
  margin-top: 20px;
  font-size: 18px;
}

.result a {
  color: #007bff;
  text-decoration: none;
}

.result a:hover {
  text-decoration: underline;
}

.search-message {
  margin-top: 10px;
  font-size: 16px;
  color: #555; /* Цвет сообщения для указания пользователя */
}

.error {
  max-width: 500px;
  text-align: center;
  display: grid;
  gap: 10px;
  color: red;
}

.controls {
  margin: 0 auto;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.qr-scanner-logo {
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50px;
}

.qr-scanner-logo img {
  width: 100px;
}

.loader {
  margin-top: 20px;
}
</style>
