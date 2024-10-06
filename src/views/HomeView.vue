<template>
  <div>
    <h1 v-if="isWiki">WIKIPEDIA</h1>
    <p>
      Modern mobile phones often have a variety of different cameras installed (e.g. front, rear, wide-angle, infrared,
      desk-view). The one picked by default is sometimes not the best choice. If you want fine-grained control, which
      camera is used, you can enumerate all installed cameras and then pick the one you need based on it's device ID:

      <select v-model="selectedDevice">
        <option v-for="device in devices" :key="device.label" :value="device">
          {{ device.label }}
        </option>
      </select>
    </p>

    <!-- <p>
      Detected codes are visually highlighted in real-time. Use the following dropdown to change the flavor:

      <select v-model="trackFunctionSelected">
        <option v-for="option in trackFunctionOptions" :key="option.text" :value="option">
          {{ option.text }}
        </option>
      </select>
    </p> -->

    <p class="error">{{ error }}</p>

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <div class="qr-scan-container">
      <div class="qr-scan-box">
        <qrcode-stream
          :constraints="{ deviceId: selectedDevice.deviceId, facingMode: 'environment' }"
          :track="trackFunctionSelected.value"
          :formats="['qr_code']"
          @error="onError"
          @detect="onDetect"
          @camera-on="onReady"
          @camera-off="onOff"
          v-if="selectedDevice !== null">
          <div class="qr-scan-border"></div>
        </qrcode-stream>
        <p v-else class="error">No cameras on this device</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const isWiki = ref(false)

function onReady(capabilities) {
  // hide loading indicator
  console.log(capabilities)
}

function onOff(capabilities) {
  // hide loading indicator
  console.log(capabilities)
}

/*** detection handling ***/

const result = ref('')

function onDetect(detectedCodes) {
  console.log(detectedCodes)
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  if (result.value.toLowerCase().includes('wikipedia')) {
    isWiki.value = true
  } else {
    isWiki.value = false
  }
}

/*** select camera ***/

const selectedDevice = ref(null)
const devices = ref([])

onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput')

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[1]
  }
})

/*** track functons ***/

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

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
function paintBoundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}
function paintCenterText(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode

    const centerX = boundingBox.x + boundingBox.width / 2
    const centerY = boundingBox.y + boundingBox.height / 2

    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    ctx.lineWidth = 3
    ctx.strokeStyle = '#35495e'
    ctx.strokeText(detectedCode.rawValue, centerX, centerY)

    ctx.fillStyle = '#5cb984'
    ctx.fillText(rawValue, centerX, centerY)
  }
}
const trackFunctionOptions = [
  { text: 'nothing (default)', value: undefined },
  { text: 'outline', value: paintOutline },
  { text: 'centered text', value: paintCenterText },
  { text: 'bounding box', value: paintBoundingBox },
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

/*** barcode formats ***/

const barcodeFormats = ref({
  aztec: false,
  code_128: false,
  code_39: false,
  code_93: false,
  codabar: false,
  databar: false,
  databar_expanded: false,
  data_matrix: false,
  dx_film_edge: false,
  ean_13: false,
  ean_8: false,
  itf: false,
  maxi_code: false,
  micro_qr_code: false,
  pdf417: false,
  qr_code: true,
  rm_qr_code: false,
  upc_a: false,
  upc_e: false,
  linear_codes: false,
  matrix_codes: false,
})
const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

/*** error handling ***/

const error = ref('')

function onError(err) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    error.value += err.message
  }
}
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
.barcode-format-checkbox {
  margin-right: 10px;
  white-space: nowrap;
}
.qr-scan-box {
  aspect-ratio: 1/1;
  max-width: 300px;
}
.qr-scan-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
/* .qr-scan-border {
  aspect-ratio: 1/1;
  max-width: 300px;
  border: 10px solid black;
  border-radius: 20px;
  position: relative;
} */
</style>
